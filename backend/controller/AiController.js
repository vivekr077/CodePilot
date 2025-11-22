import { generateResponseByAi } from "../AiModal/geminiAi.js";
import { prisma } from "../lib/prisma.js";

export const generateCodeController = async (req, res) => {
     try {
        const userId = req.user?.userId;
        const { prompt, language } = req.body;
        const response = await generateResponseByAi(prompt, language);
        
        const data = await prisma.generation.create({
            data: {
                userId,
                prompt,
                language,
                code: response
            }
        })
        return res.status(200).send({
            msg: "code successfully generated",
            response,
            data
        })
        
     } catch (error) {
        console.log(error);
        res.send({
            msg: "Response generation failed",
            status: false
        })
        
     }
}