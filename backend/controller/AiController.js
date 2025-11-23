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


export const codeHistoryController = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).send({
        msg: "Unauthorized: No user found",
        status: false,
      });
    }

    // Pagination params:
    const page = parseInt(req.query.page) || 1;      // default page 1
    const limit = parseInt(req.query.limit) || 10;   // default 10 per page
    const skip = (page - 1) * limit;

    // Fetch records for this user
    const records = await prisma.generation.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { timestamp: "desc" },
    });

    // Count total for pagination UI
    const totalCount = await prisma.generation.count({
      where: { userId },
    });

    return res.status(200).send({
      msg: "History fetched successfully",
      status: true,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      records,
    });

  } catch (error) {
    console.log("Error fetching history:", error);
    return res.status(500).send({
      msg: "Failed to fetch history",
      status: false,
    });
  }
};
