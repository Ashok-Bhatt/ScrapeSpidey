import News from "../models/news.model";

const createNews = async (req, res) => {

    try {
        const {title, description, date} = req.body;
    
        if (!title || !title.trim()) return res.status(400).json({message: "news title is required!"});
        if (!description || !description.trim()) return res.status(400).json({message: "news description is required!"});

        const newNews = await News.create({
            title : title,
            description: description,
            date: date || new Date(),
        })

        if (!newNews) return req.status(500).json({message: "News not created!"});
        return res.status(201).json({message : "News created successfully!"});
    } catch (error){
        console.log("Error while creating news:", error.message);
        return res.status(500).json({message : "Something Went Wrong! News not created!"});
    }
}

export {
    createNews,
}