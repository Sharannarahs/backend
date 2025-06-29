import jwt from "jsonwebtoken";

// function to generate a token for user

export const generateToken = ({userId}) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET); //{ userId: userId }
    return token;

}



/* DESTRUCTURING
const generateToken = ({ userId }) => {
  console.log(userId);
};

generateToken({ userId: "abc123" });  // ✅ Output: abc123
It’s the same as writing:

js
Copy code
const generateToken = (data) => {
  const userId = data.userId;
  console.log(userId);
};
*/