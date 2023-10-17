import { Request, Response } from "express";
import { google } from 'googleapis'
const customSearch = google.customsearch('v1')
const googleSearchCredentials = {
    apiKey: "AIzaSyDSuKZnB37qqeGAbINHwqHnty3GQ61uXeo",
    searchEngineId: "a19ca6bb4342343b8"
}

const searchMedicationImage = async (name: string) => {
    const response = await customSearch.cse.list({
        auth: googleSearchCredentials.apiKey,
        cx: googleSearchCredentials.searchEngineId,
        q: name,
        searchType: "image",
        num: 1
    })

    const link = response.data.items?.[0].link
    console.log(link)
    return link ? link : "Image not found"
}

export default {
    async findByName(req: Request, res: Response): Promise<Response> {
        const { name } = req.params
        const linkImage =  await searchMedicationImage(name)
        return res.json(linkImage)
    },

}

