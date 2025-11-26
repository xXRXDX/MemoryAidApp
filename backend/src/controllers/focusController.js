import Focus from "../models/focus.model.js";

export const startFocus = async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    const session = await Focus.create({
      userId,
      taskId,
      startTime: new Date(),
      endTime: null,
      isActive: true,
    });

    res.status(201).json({ message: "Focus session started", session });
  } catch (error) {
    res.status(500).json({ error: "Error starting focus session" });
  }
};

export const endFocus = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await Focus.findByIdAndUpdate(
      sessionId,
      {
        endTime: new Date(),
        isActive: false,
      },
      { new: true }
    );

    res.status(200).json({ message: "Focus session ended", session });
  } catch (error) {
    res.status(500).json({ error: "Error ending focus session" });
  }
};

export const getFocusStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await Focus.find({ userId });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching focus stats" });
  }
};
