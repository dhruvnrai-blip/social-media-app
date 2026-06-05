const {signupUser, loginUser, forgotPassword, resetPassword, verifyEmail, refreshAccessToken} = require("../services/authService");
const { signupSchema } = require("../validators/authValidator");

const signup = async (req, res) => {

  try {
    const validatedData = signupSchema.parse(req.body);

    const {
      username,
      email,
      password
    } = validatedData;

    const result = await signupUser({
      username,
      email,
      password
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });

  } catch (error) {

  console.log(error);

  res.status(400).json({
    success: false,
    message:
      error.issues?.[0]?.message ||
      error.errors?.[0]?.message ||
      error.message
  });

}
};
const login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const result = await loginUser({
      email,
      password
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};
const forgotPasswordController =
  async (req, res) => {

    try {

      const { email } =
        req.body;

      const result =
        await forgotPassword(
          email
        );

      res.status(200).json({

        success: true,

        message:
          result.message

      });

    }

    catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message

      });

    }
};
const resetPasswordController =
  async (req, res) => {

    try {

      const { token } =
        req.params;

      const { password } =
        req.body;

      const result =
        await resetPassword(
          token,
          password
        );

      res.status(200).json({

        success: true,

        message:
          result.message

      });

    }

    catch (error) {

      res.status(400).json({

        success: false,

        message:
          error.message

      });

    }
};
const verifyEmailController =
async (req,res)=>{

    try{

        const { token } =
            req.params;

        const result =
            await verifyEmail(token);

        res.status(200).json({
            success:true,
            message:result.message
        });

    }
    catch(error){

        res.status(400).json({
            success:false,
            message:error.message
        });

    }
};

const refresh=async(req,res)=>{
try{
const{refreshToken}=req.body;
const result=await refreshAccessToken(refreshToken);
res.status(200).json(result);
}catch(err){
res.status(401).json({success:false,message:err.message});
}
};

module.exports = {
  signup,
  login,
  forgotPasswordController,
  resetPasswordController,
  verifyEmailController,
  refresh
};