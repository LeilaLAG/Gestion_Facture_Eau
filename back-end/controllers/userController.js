const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const getUsers = async (req, res) => {
  const { companyId } = req.params;
  try {
    const users = await User.find({ companyId, function: "Employer" });
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(400).json({
      error: "Un erreur est servenue lors de l'obtention des données !",
    });
  }
};

const getOneUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(400).json({
      error: "Un erreur est servenue lors de l'obtention des données !",
    });
  }
};

const createUser = async (req, res) => {
  // const adminPass = process.env.AdminPass

  try {
    // if(req.body.function === "Admin"){
    //   if(req.body.password != adminPass){
    //     return res.status(400).json({ error: "Votre Admin mot de passe est invalide !" });
    //   }
    // }
    // else if(req.body.function === "Employer"){
    //   const findingCompany = await Company.findOne({_id : req.body.companyId}) ;

    //   if(!findingCompany){
    //     return res.status(400).json({ error: "Ce ID de société est invalide !" });
    //   }

    //   req.body.companyId = findingCompany.companyName

    // }

    const isEmailexist = await User.findOne({ email: req.body.email });

    if (!isEmailexist) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const addedUser = await User.create({
        ...req.body,
        password: hashedPassword,
      });
      return res.status(200).json({ addedUser });
    }
    return res.status(200).json({ isEmailexist });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Un erreur est servenue lors de l'enregistrement !" });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const isEmailexist = await User.findOne({
      email: req.body.email,
      _id: { $ne: userId },
    });

    if (isEmailexist) {
      return res.status(200).json({ isEmailexist });
    }
    const userToUpdate = await User.findOneAndUpdate({ _id: userId }, req.body);
    return res.status(200).json({ userToUpdate });
  } catch (err) {
    return res.status(400).json({ error: "Error updating user" });
  }
};

const updateEmployeePrivileges = async (req, res) => {
  const { privileges, crudAccess } = req.body;

  try {
    // Update privileges
    const updatePrivPromises = privileges.map((grant) =>
      User.findOneAndUpdate(
        { _id: grant.empID },
        {
          $set: {
            "privileges.clients": grant.clients,
            "privileges.compteurs": grant.compteurs,
            "privileges.factures": grant.factures,
            "privileges.tranches": grant.tranches,
          },
        },
        { new: true } // Return the updated document
      )
    );

    // Update CRUD access
    const updateCrudPromises = crudAccess.map((crud) =>
      User.findOneAndUpdate(
        { _id: crud.empID },
        {
          $set: {
            "crudAccess.clients": {
              add: crud.clients.add,
              mod: crud.clients.mod,
              dlt: crud.clients.dlt,
            },
            "crudAccess.compteurs": {
              add: crud.compteurs.add,
              mod: crud.compteurs.mod,
              dlt: crud.compteurs.dlt,
            },
            "crudAccess.factures": {
              add: crud.factures.add,
              mod: crud.factures.mod,
              dlt: crud.factures.dlt,
            },
            "crudAccess.tranches": {
              add: crud.tranches.add,
              mod: crud.tranches.mod,
              dlt: crud.tranches.dlt,
            },
          },
        },
        { new: true } // Return the updated document
      )
    );

    // Combine all promises
    const results = await Promise.all([...updatePrivPromises, ...updateCrudPromises]);

    return res.status(200).json({
      success: "Les privilèges ont été modifiés avec succès.",
      results,
    });
  } catch (err) {
    console.error("Error updating employee privileges:", err);
    return res.status(400).json({
      error: "Une erreur est survenue lors de la modification !",
      details: err.message,
    });
  }
};



const deleteUser = async (req, res) => {
  const { userId } = req.params;

  const userToDelete = await User.findOneAndDelete({ _id: userId });
  res.status(200).json({ userToDelete });
};

const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const verification_code = Math.floor(
      Math.pow(10, 4 - 1) +
        Math.random() * (Math.pow(10, 4) - Math.pow(10, 4 - 1))
    );

    const transporter = nodemailer.createTransport({
      host: "mail.m5tech.ma",
      port: 587,
      secure: false, // Use false for port 587
      auth: {
        user: "anas@m5tech.ma", // Your email
        pass: "Anas@G-FE07", // Your email password
      },
    });

    // HTML email body
    const emailBody = `
            <p>Votre code vérification est: <strong>${verification_code}</strong></p>
            <div style="font-weight:900; color:#fdd85a; -webkit-text-stroke: 2px black;">
            </div>
            <br>
            <h2 style="color:#fdd85a;">------------------------------------------</h2>
            <br>
            <div style="font-family: Arial, sans-serif; color: #333;">
                <img src="/Assets/logo.png" width="50">
                <h4 style="margin-top:5px; margin-bottom:5px; font-size: 12px; color: #fdd85a;">
                    <span style="padding:5px; background-color:#463300; border-top-left-radius:10px; border-bottom-right-radius:10px;">No-Reply</span>
                </h4>
                <p style="margin: 0; font-size: 10px;">
                    <a href="mailto:support@chronoflare.com" style="font-size: 10px; text-decoration: none; color: #333; font-weight: bold;">support@chronoflare.com</a><br>
                    <span style="font-size: 10px;">+212 645-350405 | +212 524-012688</span><br>

                    <a href="https://chronoflare.com" style="color: #463300; text-decoration: none;">chronoflare.com</a>
                </p>
            </div>
        `;

    // Mail options
    const mailOptions = {
      from: '"GFE Support" <no-reply@chronoflare.com>', // Sender name and email
      to: email, // Recipient email
      subject: "RECUPERATION DE MOT DE PASSE",
      html: emailBody, // HTML body
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ verification_code });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .send("Une erreur s'est produite lors de l'envoi de l'e-mail.");
  }
};

async function ModifyPassword(req, res) {
  const { email } = req.params;

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userToUpdatePassword = await User.findOneAndUpdate(
      { email: email },
      {
        password: hashedPassword,
      }
    );
    return res.status(200).json({ userToUpdatePassword });
  } catch (err) {
    return res.status(400).json({ error: "Error updating user" });
  }
}

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  updateEmployeePrivileges,
  deleteUser,
  resetPassword,
  ModifyPassword,
};
