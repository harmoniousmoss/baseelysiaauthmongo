import { getClient } from "../utils/mongodb";
import { ObjectId } from "mongodb";

export const approveUserHandler = async ({
  params,
  user,
}: {
  params: { userId: string };
  user: any;
}) => {
  const { userId } = params;

  const db = getClient().db();
  const targetUser = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });

  if (!targetUser) {
    return {
      status: 404,
      body: { error: "User not found" },
    };
  }

  // Check if the user's email is verified
  if (targetUser.merchant_email_status !== "verified") {
    return {
      status: 400,
      body: {
        error:
          "User's email is not verified. Only users with verified emails can be approved.",
      },
    };
  }

  // Check if the user is already approved
  if (targetUser.merchant_status === "approved") {
    return {
      status: 400,
      body: { error: "User is already approved" },
    };
  }

  // Approve the user
  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { merchant_status: "approved" } }
    );

  return {
    status: 200,
    body: { message: "User approved successfully" },
  };
};
