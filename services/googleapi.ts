import axios from "axios"

export const getGoogleImage = async (name: string): Promise<string> => {
    const res = await axios.get(`http://192.168.1.115:3333/image/${name}`)
    console.log(res.data)
    return res.data
}