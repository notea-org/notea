import { NextApiRequest, NextApiResponse } from 'next';

const treeHandler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    success: true,
    data: [{ id: '1', title: 'Root', children: [] }],
  });
};

export default treeHandler;
