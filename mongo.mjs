import mongoose from "mongoose";

mongoose
  .connect(
    //AFTER LOGGING IN TO MY CLUSTER ATLAS IN CLOUD.MONGODB.COM WEBSITE THEN I WILL RUN THE NEXT LINE OF CODE
    //COPY THIS AND PASTE IN MY MONGODB GUI AND CLICK CONNECT
    "mongodb+srv://nnamdionwukwe:nnamdionwukwe@cluster0.zsory0t.mongodb.net/user"
  )
  .then(() => {
    console.log("Connected");
  })
  .catch(() => {
    console.log("failed");
  });

const newSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  zipCode: {
    type: String,
    required: true,
  },

  servicesAddress: {
    type: String,
    required: true,
  },

  apartmentOrSuite: {
    type: String,
    // required: true,
  },

  residentialHomeSquareFeet: {
    type: String,
    required: true,
  },

  lightCommercialOfficeSquareFeet: {
    type: String,
    required: true,
  },

  selectBedRoomsValue: {
    type: String,
    required: true,
  },

  selectBathRoomsValue: {
    type: String,
    required: true,
  },

  lightCommercialSelectedOfficeValue: {
    type: String,
    required: true,
  },

  lightCommercialSelectedOfficeBathRoomsValue: {
    type: String,
    required: true,
  },

  lightCommercialRecurring: {
    type: String,
    // required: true,
  },

  lightCommercialOneTimeClean: {
    type: String,
    // required: true,
  },

  textMeMessages: {
    type: String,
    // required: true,
  },
});

export const collection = mongoose.model("collection", newSchema);

// const newSchema = new mongoose.Schema({
//   msg: {
//     type: String,
//     required: true,
//   },
// });

// export const collection = mongoose.model("collection", newSchema);

// module.exports = collection;

// const UserSchema = new mongoose.Schema({
//   username: {
//     type: mongoose.Schema.Types.String,
//     required: true,
//     unique: true,
//   },
//   displayname: mongoose.Schema.Types.String,
//   password: {
//     type: mongoose.Schema.Types.String,
//     required: true,
//   },
// });

// export const User = mongoose.model("User", UserSchema);
