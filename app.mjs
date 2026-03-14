// import { Collection } from "mongoose";
import express from "express";
import cors from "cors";
import { collection } from "./mongo.mjs";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", cors(), (req, res) => {
  res.send(req.body);
});

app.post("/", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    zipCode,
    servicesAddress,
    apartmentOrSuite,
    residentialHomeSquareFeet,
    lightCommercialOfficeSquareFeet,
    selectBedRoomsValue,
    selectBathRoomsValue,
    lightCommercialSelectedOfficeValue,
    lightCommercialSelectedOfficeBathRoomsValue,
    lightCommercialRecurring,
    lightCommercialOneTimeClean,
    textMeMessages,
  } = req.body;

  const data = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    zipCode: zipCode,
    servicesAddress: servicesAddress,
    apartmentOrSuite: apartmentOrSuite,
    residentialHomeSquareFeet: residentialHomeSquareFeet,
    lightCommercialOfficeSquareFeet: lightCommercialOfficeSquareFeet,
    selectBedRoomsValue: selectBedRoomsValue,
    selectBathRoomsValue: selectBathRoomsValue,
    lightCommercialSelectedOfficeValue: lightCommercialSelectedOfficeValue,
    lightCommercialSelectedOfficeBathRoomsValue:
      lightCommercialSelectedOfficeBathRoomsValue,
    lightCommercialRecurring: lightCommercialRecurring,
    lightCommercialOneTimeClean: lightCommercialOneTimeClean,
    textMeMessages: textMeMessages,
  };

  await collection.insertMany([data]);
  // res.send(msg);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Runnimg on Port ${PORT}`);
});
