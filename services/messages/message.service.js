import messageModel from "../../models/message.model.js";

export const createMessage = async props => await messageModel.create(props);