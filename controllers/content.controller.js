const Content = require('../models/Content.model')
const User = require('../models/User.model')

const { sendMail } = require('../utils/email.util')

exports.createContent = async (req, res) => {
    try {
        const content = await Content.create(req.body);
        res.status(201).json({ message: `New content created`, content })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.readAllContents = async (req, res) => {
    try {

        const { status, keyword, page = 1, limit = 10 } = req.query;

        const query = {}

        if (status) {
            query.status = status
        }

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ]
        }

        const totalContentCount = await Content.countDocuments(query)

        const limitCount = parseInt(limit)

        const pageNo = parseInt(page)

        const skipNumber = (pageNo - 1) * limitCount

        const totalPage = Math.ceil(totalContentCount / limitCount)

        const contents = await Content.find(query).skip(skipNumber).limit(limitCount)

        res.status(200).json({
            contents, pageNo, totalPage,totalContentCount
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.readContentById = async (req, res) => {
    try {
        const contentId = req.params.id;

        const content = await Content.findById(contentId).populate('createdBy', 'email')

        if (!content) return res.status(404).json({ message: 'No content found' })

        res.status(200).json(content)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.userSpecificContent = async (req, res) => {
    try {
        const userId = req.params.id;
        const { page = 1, limit = 10, status } = req.query;

        const limitCount = parseInt(limit);
        const pageNo = parseInt(page);
        const skipNumber = (pageNo - 1) * limitCount;

        const filter = { createdBy: userId };
        if (status && status !== "all") {
            filter.status = status;
        }

        const totalContentCount = await Content.countDocuments(filter);
        const totalPage = Math.ceil(totalContentCount / limitCount);

        const contents = await Content.find(filter)
            .skip(skipNumber)
            .limit(limitCount);

        res.status(200).json({
            contents,
            pageNo,
            totalPage,
            totalContentCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.approveContent = async (req, res) => {
    try {
        const contentId = req.params.id;

        const content = await Content.findById(contentId)

        if (!content) return res.status(404).json({ message: 'No content found' })

        content.status = 'approved'

        await content.save()

        const user = await User.findById(content.createdBy)

        if (!user || !user.email) {
            return res.status(400).json({ message: 'User can not be found to send notification' })
        }

        await sendMail(user.email,
            "Your content has been approved",
            `<h2>Hello ${user.email}</h2>
            <p>Your content titled <b>${content.title}</b> has been approved.</p>
            <p>You can now view it on our platform.</p>`
        )

        res.status(200).json({ message: 'Content approved and email sent', content })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.rejectContent = async (req, res) => {
    try {
        const contentId = req.params.id;

        const content = await Content.findById(contentId)

        if (!content) return res.status(404).json({ message: 'No content found' })

        content.status = 'rejected'

        await content.save()

        const user = await User.findById(content.createdBy)

        if (!user || !user.email) {
            return res.status(400).json({ message: 'User can not be found to send notification' })
        }

        await sendMail(user.email,
            "Your content has been rejected",
            `<h2>Hello ${user.email}</h2>
            <p>Sorry! your content titled <b>${content.title}</b> has been rejected.</p>
            `
        )

        res.status(200).json({ message: 'Content rejected and email sent', content })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.contentStats = async(req,res)=>{
    try {
        const totalSubmissions = await Content.countDocuments();
        const totalApproves = await Content.countDocuments({status:'approved'})
        const totalPending = await Content.countDocuments({status: 'pending'})

        const totalRejected = await Content.countDocuments({status:'rejected'})

        res.status(200).json({totalApproves,totalPending,totalRejected,totalSubmissions})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.recentContents = async(req,res)=>{
    try {
        const contents = await Content.find({status:{$in:['approved', 'rejected']}}).sort({updatedAt: -1}).limit(5)

        res.status(200).json(contents)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
