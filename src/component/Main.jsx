import { useState } from "react";
import axios from "axios";
import styles from "./Main.module.css";

export default function Main() {
  //SENDING TO BACKEND
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [servicesAddress, setServiceAddress] = useState("");
  const [apartmentOrSuite, setApartmentOrSuite] = useState("");
  const [residentialHomeSquareFeet, setResidentialHomeSquareFeet] =
    useState("");
  const [lightCommercialOfficeSquareFeet, setLightCommercialOfficeSquareFeet] =
    useState("");
  const [selectBedRoomsValue, setSelectBedRoomsValue] = useState("");
  const [selectBathRoomsValue, setSelectBathRoomsValue] = useState("");

  const [
    lightCommercialSelectedOfficeValue,
    setLightCommercialSelectedOfficeValue,
  ] = useState("");

  const [
    lightCommercialSelectedOfficeBathRoomsValue,
    setLightCommercialSelectedOfficeBathRoomsValue,
  ] = useState("");

  const [lightCommercialRecurring, setLightCommercialRecurring] =
    useState("weekly");

  const [lightCommercialOneTimeClean, setLightCommercialOneTimeClean] =
    useState("");

  const [textMeMessages, setTextMeMessages] = useState("");

  //NORMAL TOGGLE STATE
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [isOpen6, setIsOpen6] = useState(false);
  const [isOpen7, setIsOpen7] = useState(false);
  const [isOpen8, setIsOpen8] = useState(false);
  const [isOpen9, setIsOpen9] = useState(false);
  const [isOpen10, setIsOpen10] = useState(false);
  const [isOpen11, setIsOpen11] = useState(false);
  const [isOpen12, setIsOpen12] = useState(false);
  const [toggleRadio, setToggleRadio] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false);

  const [selectBedRooms, setSelectBedRooms] = useState(false);
  const [selectBathRooms, setSelectBathRooms] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(false);
  const [selectedOfficeBathRooms, setSelectedOfficeBathRooms] = useState(false);
  const [isOpenCheck, setIsOpenCheck] = useState(false);
  const [residential, setResidential] = useState(true);
  const [recurring, setRecurring] = useState(true);
  const [oneTime, setOneTime] = useState(false);
  const [lightCommercial, setLightCommercial] = useState(false);
  const [moveInOut, setMoveInOut] = useState(true);
  const [oneWeek, setOneWeek] = useState(true);
  const [oneTimeClean, setOneTimeClean] = useState(false);

  function handleResidential() {
    setResidential(true);
    setLightCommercial(false);
    setSelectedOffice(false);
    setSelectedOfficeBathRooms(false);
  }

  function handleCommercial() {
    setResidential(false);
    setOneTime(false);
    setSelectBedRooms(false);
    setSelectBathRooms(false);
    // setRecurring(false);
    setLightCommercial(true);
  }

  function handleClickOneTime() {
    setOneTime(true);
    setRecurring(false);
  }

  function handleRecurring() {
    setOneTime(false);
    setRecurring(true);
  }

  // function handleClickOneTime2() {
  //   // setOneTime(true);
  //   // setRecurring(false);
  // }

  // function handleRecurring2() {
  //   // setOneTime(false);
  //   // setRecurring(true);
  // }

  function handleOneWeek() {
    setOneWeek(true);
    setOneTimeClean(false);
  }

  function handleOneTimeClean() {
    setOneTimeClean(true);
    setOneWeek(false);
  }

  //BEDROOM
  //BEDROOM
  //BEDROOM
  //BEDROOM
  //BEDROOM

  function handleSelectBedRooms() {
    setSelectBedRooms((is) => !is);
    setSelectBathRooms(false);
  }

  function handleSelectedBedRoomsValueNone() {
    setSelectBedRoomsValue(0);
    setSelectBedRooms(false);

    //SETS THE WARNING BACK TO FALSE
    setIsOpen9(false);

    //CALL THE SELECTED BEDROOMS FUNCTION
    handleResidentialBedRooms();
  }

  function handleSelectedBedRoomsValue1() {
    setSelectBedRoomsValue(1);
    setSelectBedRooms(false);

    //SETS THE WARNING BACK TO FALSE
    setIsOpen9(false);

    //CALL THE SELECTED BEDROOMS FUNCTION
    handleResidentialBedRooms();
  }

  function handleSelectedBedRoomsValue2() {
    setSelectBedRoomsValue(2);
    setSelectBedRooms(false);

    //SETS THE WARNING BACK TO FALSE
    setIsOpen9(false);

    //CALL THE SELECTED BEDROOMS FUNCTION
    handleResidentialBedRooms();
  }

  function handleSelectedBedRoomsValue3() {
    setSelectBedRoomsValue(3);
    setSelectBedRooms(false);

    //SETS THE WARNING BACK TO FALSE
    setIsOpen9(false);

    //CALL THE SELECTED BEDROOMS FUNCTION
    handleResidentialBedRooms();
  }

  function handleSelectedBedRoomsValue4() {
    setSelectBedRoomsValue(4);
    setSelectBedRooms(false);

    //SETS THE WARNING BACK TO FALSE
    setIsOpen9(false);

    //CALL THE SELECTED BEDROOMS FUNCTION
    handleResidentialBedRooms();
  }

  function handleSelectedBedRoomsValue5() {
    setSelectBedRoomsValue(5);
    setSelectBedRooms(false);

    //SETS THE WARNING BACK TO FALSE
    setIsOpen9(false);

    //CALL THE SELECTED BEDROOMS FUNCTION
    handleResidentialBedRooms();
  }

  //BATHROOM
  //BATHROOM
  //BATHROOM
  //BATHROOM
  //BATHROOM
  //BATHROOM

  function handleSelectBathRooms() {
    setSelectBathRooms((is) => !is);
    setSelectBedRooms(false);
  }

  function handleSelectedBathRoomsValueNone() {
    setSelectBathRoomsValue(0);
    setSelectBathRooms(false);

    setIsOpen10(false);

    //CALL THE SELECTED BATHROOMS FUNCTION
    handleResidentialBathRoom();
  }

  function handleSelectedBathRoomsValue1() {
    setSelectBathRoomsValue(1);
    setSelectBathRooms(false);

    setIsOpen10(false);

    //CALL THE SELECTED BATHROOMS FUNCTION
    handleResidentialBathRoom();
  }

  function handleSelectedBathRoomsValue2() {
    setSelectBathRoomsValue(2);
    setSelectBathRooms(false);

    setIsOpen10(false);

    //CALL THE SELECTED BATHROOMS FUNCTION
    handleResidentialBathRoom();
  }

  function handleSelectedBathRoomsValue3() {
    setSelectBathRoomsValue(3);
    setSelectBathRooms(false);

    setIsOpen10(false);

    //CALL THE SELECTED BATHROOMS FUNCTION
    handleResidentialBathRoom();
  }

  function handleSelectedBathRoomsValue4() {
    setSelectBathRoomsValue(4);
    setSelectBathRooms(false);

    setIsOpen10(false);

    //CALL THE SELECTED BATHROOMS FUNCTION
    handleResidentialBathRoom();
  }

  function handleSelectedBathRoomsValue5() {
    setSelectBathRoomsValue(5);
    setSelectBathRooms(false);

    setIsOpen10(false);

    //CALL THE SELECTED BATHROOMS FUNCTION
    handleResidentialBathRoom();
  }

  //LIGHT COMMERCIAL OFFICES
  //LIGHT COMMERCIAL OFFICES
  //LIGHT COMMERCIAL OFFICES
  //LIGHT COMMERCIAL OFFICES
  //LIGHT COMMERCIAL OFFICES

  function handleLightCommercialSelectedOffice() {
    setSelectedOffice((is) => !is);
    setSelectedOfficeBathRooms(false);
  }

  function lightCommercialSelectedOfficeValueNone() {
    setLightCommercialSelectedOfficeValue(0);
    setSelectedOffice(false);

    setIsOpen11(false);

    //CALL THE SELECTED LIGHT COMMERCIAL OFFICE FUNCTION
    handleLightCommercialOffices();
  }

  function lightCommercialSelectedOfficeValue1() {
    setLightCommercialSelectedOfficeValue(1);
    setSelectedOffice(false);

    setIsOpen11(false);

    //CALL THE SELECTED LIGHT COMMERCIAL OFFICE FUNCTION
    handleLightCommercialOffices();
  }

  function lightCommercialSelectedOfficeValue2() {
    setLightCommercialSelectedOfficeValue(2);
    setSelectedOffice(false);

    setIsOpen11(false);

    //CALL THE SELECTED LIGHT COMMERCIAL OFFICE FUNCTION
    handleLightCommercialOffices();
  }

  function lightCommercialSelectedOfficeValue3() {
    setLightCommercialSelectedOfficeValue(3);
    setSelectedOffice(false);

    setIsOpen11(false);

    //CALL THE SELECTED LIGHT COMMERCIAL OFFICE FUNCTION
    handleLightCommercialOffices();
  }

  function lightCommercialSelectedOfficeValue4() {
    setLightCommercialSelectedOfficeValue(4);
    setSelectedOffice(false);

    setIsOpen11(false);

    //CALL THE SELECTED LIGHT COMMERCIAL OFFICE FUNCTION
    handleLightCommercialOffices();
  }

  function lightCommercialSelectedOfficeValue5() {
    setLightCommercialSelectedOfficeValue(5);
    setSelectedOffice(false);

    setIsOpen11(false);

    //CALL THE SELECTED LIGHT COMMERCIAL OFFICE FUNCTION
    handleLightCommercialOffices();
  }

  ///LIGHT COMMERCIAL OFFICES BATHROOM
  //LIGHT COMMERCIAL OFFICES ATHROOM
  ///LIGHT COMMERCIAL OFFICES BATHROOM
  ///LIGHT COMMERCIAL OFFICES BATHROOM
  ///LIGHT COMMERCIAL OFFICES BATHROOM
  ///LIGHT COMMERCIAL OFFICES BATHROOM

  function handleLightCommercialSelectedOfficeBathRooms() {
    setSelectedOfficeBathRooms((is) => !is);
    setSelectedOffice(false);
  }

  function handlelightCommercialSelectedOfficeBathRoomsValueNone() {
    setLightCommercialSelectedOfficeBathRoomsValue(0);
    setSelectedOfficeBathRooms(false);

    setIsOpen12(false);

    //CALL THE SELECTED LIGHT COMMERCIAL OFFICE BATHROOM FUNCTION
    handleLightCommercialBathRooms();
  }

  function handlelightCommercialSelectedOfficeBathRoomsValue1() {
    setLightCommercialSelectedOfficeBathRoomsValue(1);
    setSelectedOfficeBathRooms(false);

    setIsOpen12(false);

    //CALL THE SELECTED LIGHT COMMERCIAL OFFICE BATHROOM FUNCTION
    handleLightCommercialBathRooms();
  }

  function handlelightCommercialSelectedOfficeBathRoomsValue2() {
    setLightCommercialSelectedOfficeBathRoomsValue(2);
    setSelectedOfficeBathRooms(false);

    setIsOpen12(false);

    //CALL THE SELECTED LIGHT COMMERCIAL OFFICE BATHROOM FUNCTION
    handleLightCommercialBathRooms();
  }

  function handlelightCommercialSelectedOfficeBathRoomsValue3() {
    setLightCommercialSelectedOfficeBathRoomsValue(3);
    setSelectedOfficeBathRooms(false);

    setIsOpen12(false);

    //CALL THE SELECTED LIGHT COMMERCIAL OFFICE BATHROOM FUNCTION
    handleLightCommercialBathRooms();
  }

  function handlelightCommercialSelectedOfficeBathRoomsValue4() {
    setLightCommercialSelectedOfficeBathRoomsValue(4);
    setSelectedOfficeBathRooms(false);

    setIsOpen12(false);

    //CALL THE SELECTED LIGHT COMMERCIAL OFFICE BATHROOM FUNCTION
    handleLightCommercialBathRooms();
  }

  function handlelightCommercialSelectedOfficeBathRoomsValue5() {
    setLightCommercialSelectedOfficeBathRoomsValue(5);
    setSelectedOfficeBathRooms(false);

    setIsOpen12(false);

    //CALL THE SELECTED LIGHT COMMERCIAL OFFICE BATHROOM FUNCTION
    handleLightCommercialBathRooms();
  }

  //LIGHT COMMERCIAL RECURRING
  //LIGHT COMMERCIAL RECURRING
  //LIGHT COMMERCIAL RECURRING
  //LIGHT COMMERCIAL RECURRING
  //LIGHT COMMERCIAL RECURRING
  //LIGHT COMMERCIAL RECURRING
  function handleWeekly() {
    setLightCommercialRecurring("weekly");
    setLightCommercialOneTimeClean("");
    setLightCommercialOneTimeClean("");
  }

  function handleOtherWeek() {
    setLightCommercialRecurring("every Other Week");
    setLightCommercialOneTimeClean("");
    setLightCommercialOneTimeClean("");
  }
  function handle4Weeks() {
    setLightCommercialRecurring("once In 4 Weeks");
    setLightCommercialOneTimeClean("");
    setLightCommercialOneTimeClean("");
  }

  //ONE TIME CLEAN
  //ONE TIME CLEAN
  //ONE TIME CLEAN
  function handleYes() {
    setLightCommercialOneTimeClean("yes");
    setLightCommercialRecurring("");
    setLightCommercialRecurring("");
    setLightCommercialRecurring("");
  }
  function handleNo() {
    setLightCommercialOneTimeClean("no");
    setLightCommercialRecurring("");
    setLightCommercialRecurring("");
    setLightCommercialRecurring("");
  }

  //FIRST NAME INPUT FORMS
  function handleFirstName(e) {
    setFirstName(e.target.value);
    firstName.length >= 0 && setIsOpen1(false);
    !firstName.length && setIsOpenCheck(false);
  }

  //LAST NAME  INPUT FORMS
  function handleLastName(e) {
    setLastName(e.target.value);
    lastName.length >= 0 && setIsOpen2(false);
    !lastName.length && setIsOpenCheck(false);
  }

  //EMAIL ADRESS  INPUT FORMS
  function handleEmailAddress(e) {
    setEmail(e.target.value);
    email.length >= 0 && setIsOpen3(false);
    !email.length && setIsOpenCheck(false);
  }

  //PHONE NUMBER  INPUT FORMS
  function handlePhoneNumber(e) {
    setPhoneNumber(e.target.value);
    phoneNumber.length >= 0 && setIsOpen4(false);
    !phoneNumber.length && setIsOpenCheck(false);
  }

  //APARTMENT/SUITE   INPUT FORMS
  function handleZipCode(e) {
    setZipCode(e.target.value);
    zipCode.length >= 0 && setIsOpen5(false);
    !zipCode.length && setIsOpenCheck(false);
  }

  //SERVICE ADDRESS  INPUT FORMS
  function handleServiceAddress(e) {
    setServiceAddress(e.target.value);
    servicesAddress.length >= 0 && setIsOpen6(false);
    !servicesAddress.length && setIsOpenCheck(false);
    // !servicesAddress.length ? setIsOpenCheck(false) : setIsOpenCheck(false);
  }

  //RESIDENTIAL HOME SQUARE FEET INPUT FORMS
  function handleResidentialHomeSquareFeet(e) {
    setResidentialHomeSquareFeet(e.target.value);
    residentialHomeSquareFeet.length >= 0 && setIsOpen7(false);
    !residentialHomeSquareFeet.length && setIsOpenCheck(false);
  }

  //LIGHT COMMERCIAL OFFICE SQUARE FEET INPUT FORMS
  function handleLightCommercialOfficeSquareFeet(e) {
    setLightCommercialOfficeSquareFeet(e.target.value);
    lightCommercialOfficeSquareFeet.length >= 0 && setIsOpen8(false);
    !lightCommercialOfficeSquareFeet.length && setIsOpenCheck(false);
  }

  //  function handleSelectedBedRoomsValueNone() {
  //   setSelectBedRoomsValue("none");
  //   setSelectBedRooms(false);
  //   setIsOpen9(false);

  //   //CALL THE SELECTED BEDROOMS FUNCTION
  //   handleResidentialBedRooms();
  // }

  //SELECT RESIDENTIAL BEDROOM VALUE INPUT FORMS
  function handleResidentialBedRooms() {
    selectBedRoomsValue.length >= 0 && setIsOpen9(false);
    !selectBedRoomsValue.length && setIsOpenCheck(false);
  }

  //SELECT RESIDENTIAL BATHROOM VALUE INPUT FORM
  function handleResidentialBathRoom() {
    lightCommercialOfficeSquareFeet.length >= 0 && setIsOpen10(false);
    !lightCommercialOfficeSquareFeet.length && setIsOpenCheck(false);
  }

  //SELECT LIGHT COMMERCIAL OFFICE VALUE INPUT FORM
  function handleLightCommercialOffices() {
    lightCommercialSelectedOfficeValue.length >= 0 && setIsOpen11(false);
    !lightCommercialSelectedOfficeValue.length && setIsOpenCheck(false);
  }

  //SELECT LIGHT COMMERCIAL BATHROOM VALUE INPUT FORM
  function handleLightCommercialBathRooms() {
    lightCommercialSelectedOfficeBathRoomsValue.length >= 0 &&
      setIsOpen12(false);
    !lightCommercialSelectedOfficeBathRoomsValue.length &&
      setIsOpenCheck(false);
  }

  //YES TEXT ME MESSAGES FUNCTION
  function handleTextMeMessages() {
    setToggleRadio((is) => !is);
    !toggleRadio && setTextMeMessages("Yes send me service reminders");

    toggleRadio && setTextMeMessages("No don't send me service reminders");
  }

  //FORM SUBMIT BUTTON
  //FORM SUBMIT BUTTON
  //FORM SUBMIT BUTTON
  async function handleSubmitForm(e) {
    e.preventDefault();

    !firstName.length && setIsOpenCheck(false);
    !firstName.length && setIsOpen1(true);

    !lastName.length && setIsOpenCheck(false);
    !lastName.length && setIsOpen2(true);

    !email.length && setIsOpenCheck(false);
    !email.length && setIsOpen3(true);

    !phoneNumber.length && setIsOpenCheck(false);
    !phoneNumber.length && setIsOpen4(true);

    !zipCode.length && setIsOpenCheck(false);
    !zipCode.length && setIsOpen5(true);

    !servicesAddress.length && setIsOpenCheck(false);
    !servicesAddress.length && setIsOpen6(true);

    !residentialHomeSquareFeet.length && setIsOpenCheck(false);
    !residentialHomeSquareFeet.length && setIsOpen7(true);

    !lightCommercialOfficeSquareFeet.length && setIsOpenCheck(false);
    !lightCommercialOfficeSquareFeet.length && setIsOpen8(true);

    !selectBedRoomsValue.length && setIsOpenCheck(false);
    !selectBedRoomsValue.length && setIsOpen9(true);
    selectBedRoomsValue === 0 && setIsOpen9(false);
    selectBedRoomsValue === 1 && setIsOpen9(false);
    selectBedRoomsValue === 2 && setIsOpen9(false);
    selectBedRoomsValue === 3 && setIsOpen9(false);
    selectBedRoomsValue === 4 && setIsOpen9(false);
    selectBedRoomsValue === 5 && setIsOpen9(false);

    !selectBathRoomsValue.length && setIsOpenCheck(false);
    !selectBathRoomsValue.length && setIsOpen10(true);
    selectBathRoomsValue === 0 && setIsOpen10(false);
    selectBathRoomsValue === 1 && setIsOpen10(false);
    selectBathRoomsValue === 2 && setIsOpen10(false);
    selectBathRoomsValue === 3 && setIsOpen10(false);
    selectBathRoomsValue === 4 && setIsOpen10(false);
    selectBathRoomsValue === 5 && setIsOpen10(false);

    !lightCommercialSelectedOfficeValue.length && setIsOpenCheck(false);
    !lightCommercialSelectedOfficeValue.length && setIsOpen11(true);
    lightCommercialSelectedOfficeValue === 0 && setIsOpen11(false);
    lightCommercialSelectedOfficeValue === 1 && setIsOpen11(false);
    lightCommercialSelectedOfficeValue === 2 && setIsOpen11(false);
    lightCommercialSelectedOfficeValue === 3 && setIsOpen11(false);
    lightCommercialSelectedOfficeValue === 4 && setIsOpen11(false);
    lightCommercialSelectedOfficeValue === 5 && setIsOpen11(false);

    !lightCommercialSelectedOfficeBathRoomsValue.length &&
      setIsOpenCheck(false);
    !lightCommercialSelectedOfficeBathRoomsValue.length && setIsOpen12(true);
    lightCommercialSelectedOfficeBathRoomsValue === 0 && setIsOpen12(false);
    lightCommercialSelectedOfficeBathRoomsValue === 1 && setIsOpen12(false);
    lightCommercialSelectedOfficeBathRoomsValue === 2 && setIsOpen12(false);
    lightCommercialSelectedOfficeBathRoomsValue === 3 && setIsOpen12(false);
    lightCommercialSelectedOfficeBathRoomsValue === 4 && setIsOpen12(false);
    lightCommercialSelectedOfficeBathRoomsValue === 5 && setIsOpen12(false);

    setFormSubmit(true);

    if (
      firstName.length >= 1 &&
      lastName.length >= 1 &&
      email.length >= 1 &&
      phoneNumber.length >= 1 &&
      zipCode.length >= 1 &&
      servicesAddress.length >= 1 &&
      residentialHomeSquareFeet.length >= 1 &&
      lightCommercialOfficeSquareFeet.length >= 1 &&
      selectBedRoomsValue <= 5 &&
      selectBathRoomsValue <= 5 &&
      lightCommercialSelectedOfficeValue <= 5 &&
      lightCommercialSelectedOfficeBathRoomsValue <= 5
      // selectBedRoomsValue === 0
      // selectBedRoomsValue.length
    ) {
      setIsOpenCheck(true),
        setFirstName(""),
        setLastName(""),
        setEmail(""),
        setPhoneNumber(""),
        setZipCode(""),
        setServiceAddress(""),
        setApartmentOrSuite(""),
        setResidentialHomeSquareFeet(""),
        setLightCommercialOfficeSquareFeet(""),
        setSelectBedRoomsValue(""),
        setSelectBathRoomsValue(""),
        setLightCommercialSelectedOfficeValue(""),
        setLightCommercialSelectedOfficeBathRoomsValue(""),
        setFormSubmit(false);

      try {
        await axios.post("http://localhost:8000/", {
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
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsOpenCheck(false);
    }
  }

  async function Submit(e) {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/", {
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
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={styles.mainDiv}>
      <div>
        <div className={styles.checkMarkMain}>
          {!isOpenCheck ? (
            <p className={styles.checkMark}>&#10004;</p>
          ) : (
            <p className={styles.checkMark1}></p>
          )}

          <p className={styles.borderLine}></p>

          {isOpenCheck ? (
            <p className={styles.checkMark}> &#10004;</p>
          ) : (
            <p className={styles.checkMark1}></p>
          )}
        </div>

        <div className={styles.started}>
          <p>Let's get started!</p>
        </div>

        <div>
          <div className={styles.star}>
            <p>*Indicates a required field</p>
          </div>

          <div>
            <div className={styles.name}>
              <h4>First Name*</h4>
            </div>

            <div className={styles.inputField}>
              <input
                type="name"
                placeholder="ex. IziBest"
                value={firstName}
                onChange={handleFirstName}
                className={styles.inputField}
              />
            </div>

            {isOpen1 && <p className={styles.error}>Enter the first name</p>}
          </div>

          <div>
            <div className={styles.name}>
              <h4>Last Name*</h4>
            </div>

            <div className={styles.inputField}>
              <input
                type="name"
                placeholder="ex. Interior"
                value={lastName}
                onChange={handleLastName}
                className={styles.inputField}
              />
            </div>

            {isOpen2 && <p className={styles.error}>Enter the last name</p>}
          </div>

          <div>
            <div className={styles.name}>
              <h4>Email*</h4>
            </div>

            <div className={styles.inputField}>
              <input
                type="email"
                placeholder="ex. izibestinterior1@gmail.com"
                value={email}
                onChange={handleEmailAddress}
                className={styles.inputField}
              />
            </div>
            {isOpen3 && (
              <p className={styles.error}>Enter a valid email address</p>
            )}
          </div>

          <div>
            <div className={styles.name}>
              <h4>Phone Number*</h4>
            </div>

            <div className={styles.inputField}>
              <input
                type="number"
                placeholder="ex. +234 803 058 8774"
                value={phoneNumber}
                onChange={handlePhoneNumber}
                className={styles.inputField}
              />
            </div>
            {isOpen4 && <p className={styles.error}>Enter the phone number</p>}
          </div>

          <div className={styles.yesDiv}>
            <div className={styles.checkbox}>
              <input
                value={textMeMessages}
                onClick={handleTextMeMessages}
                type="checkbox"
              />
            </div>

            <div className={styles.yes}>
              <p>Yes! You can text me service reminders and other messages.</p>
            </div>
          </div>

          <div className={styles.privacy}>
            <p>
              By checking this box, I agree to opt in to receive automated SMS
              and/or MMS messages from IziMaid, an IziBest company, and its
              franchisees to the provided mobile number(s). Message & data rates
              may apply. Message frequency varies. View{" "}
              <span className={styles.span}>Terms</span> and{" "}
              <span className={styles.span}> Privacy Policy</span>. Reply STOP
              to opt out of future messages. Reply HELP for help.
            </p>
          </div>

          <div>
            <div className={styles.name}>
              <h4>ZIP Code*</h4>
            </div>

            <div className={styles.inputField}>
              <input
                type="number"
                placeholder="ex. 900001"
                value={zipCode}
                onChange={handleZipCode}
                className={styles.inputField}
              />
            </div>
            {isOpen5 && <p className={styles.error}>Enter a valid ZIP code</p>}
          </div>

          <div>
            <div className={styles.name}>
              <h4>Service Address*</h4>
            </div>

            <div className={styles.inputField}>
              <input
                type="address"
                placeholder="ex. 1234 Example St Abuja, FCT"
                value={servicesAddress}
                onChange={handleServiceAddress}
                className={styles.inputField}
              />
            </div>
            {isOpen6 && (
              <p className={styles.error}>Enter a valid service address</p>
            )}
          </div>

          <div>
            <div className={styles.name}>
              <h4>Apartment/Suite (optional)</h4>
            </div>

            <div className={styles.inputField}>
              <input
                type="text"
                placeholder="ex. 123, Suite A, Unit 6B"
                value={apartmentOrSuite}
                onChange={(e) => setApartmentOrSuite(e.target.value)}
                className={styles.inputField}
              />
            </div>
          </div>

          <div className={styles.type}>
            <h4>Type of Cleaning*</h4>
          </div>

          <div className={styles.typeOfCleaning}>
            <div className={styles.radioButton}>
              <p
                onClick={handleResidential}
                className={residential ? styles.radio2 : styles.radio}
              ></p>

              <p>Residential</p>
            </div>

            <div className={styles.radioButton}>
              <p
                onClick={handleCommercial}
                className={residential ? styles.radio : styles.radio2}
              ></p>

              <p>Light Commercial</p>
            </div>
          </div>

          {residential && (
            <div>
              <div className={styles.type}>
                <h4>Frequency of Cleaning*</h4>
              </div>
              <div className={styles.typeOfCleaning}>
                <div className={styles.radioButton}>
                  <p
                    onClick={handleRecurring}
                    className={recurring ? styles.radio2 : styles.radio}
                  ></p>

                  <p>Recurring</p>
                </div>

                <div className={styles.radioButton}>
                  <p
                    onClick={handleClickOneTime}
                    className={oneTime ? styles.radio2 : styles.radio}
                  ></p>

                  <p>One-Time Clean</p>
                </div>
              </div>
            </div>
          )}

          {oneTime && (
            <div className={styles.oneTime}>
              <div className={styles.typeOfCleaning}>
                <div className={styles.radioButton1}>
                  <p
                    onClick={() => setMoveInOut(true)}
                    className={moveInOut ? styles.radio2 : styles.radio}
                  ></p>

                  <p>One-Time Clean</p>
                </div>

                <div className={styles.radioButton2}>
                  <p
                    onClick={() => setMoveInOut(false)}
                    className={moveInOut ? styles.radio : styles.radio2}
                  ></p>

                  <p>Move In/Move Out Clean</p>
                </div>
              </div>

              <div>
                <h3>Home Details</h3>
              </div>

              <div>
                <div className={styles.name}>
                  <h4>Square Feet*</h4>
                </div>

                <div className={styles.inputField}>
                  <input
                    type="text"
                    placeholder="2000"
                    value={residentialHomeSquareFeet}
                    onChange={handleResidentialHomeSquareFeet}
                    className={styles.inputField}
                  />
                </div>
                {isOpen7 && (
                  <p className={styles.error}>Enter a valid square feet</p>
                )}
              </div>

              <div className={styles.bedroomsDivMain}>
                <div className={styles.bedroomsDiv}>
                  <div className={styles.name}>
                    <h4>Bedrooms*</h4>
                  </div>

                  <div>
                    <div
                      onClick={handleSelectBedRooms}
                      className={styles.select}
                    >
                      <>{selectBedRoomsValue === "" && <p>Select</p>}</>

                      <>
                        {selectBedRoomsValue === 0 && (
                          <p>{selectBedRoomsValue}</p>
                        )}
                      </>

                      <>
                        {selectBedRoomsValue === 1 && (
                          <p>{selectBedRoomsValue}</p>
                        )}
                      </>

                      <>
                        {selectBedRoomsValue === 2 && (
                          <p>{selectBedRoomsValue}</p>
                        )}
                      </>

                      <>
                        {selectBedRoomsValue === 3 && (
                          <p>{selectBedRoomsValue}</p>
                        )}
                      </>

                      <>
                        {selectBedRoomsValue === 4 && (
                          <p>{selectBedRoomsValue}</p>
                        )}
                      </>

                      <>
                        {selectBedRoomsValue === 5 && (
                          <p>{selectBedRoomsValue}</p>
                        )}
                      </>

                      {selectBedRooms ? <p>&uarr;</p> : <p> &darr;</p>}
                    </div>

                    {selectBedRooms && (
                      <div className={styles.selectBedRoomsMain}>
                        <div className={styles.selectBedRooms}>
                          <p
                            onClick={handleSelectedBedRoomsValueNone}
                            value={selectBedRoomsValue}
                          >
                            0
                          </p>

                          <p
                            onClick={handleSelectedBedRoomsValue1}
                            value={selectBedRoomsValue}
                          >
                            1
                          </p>

                          <p
                            onClick={handleSelectedBedRoomsValue2}
                            value={selectBedRoomsValue}
                          >
                            2
                          </p>

                          <p
                            onClick={handleSelectedBedRoomsValue3}
                            value={selectBedRoomsValue}
                          >
                            3
                          </p>
                          <p
                            onClick={handleSelectedBedRoomsValue4}
                            value={selectBedRoomsValue}
                          >
                            4
                          </p>
                          <p
                            onClick={handleSelectedBedRoomsValue5}
                            value={selectBedRoomsValue}
                          >
                            5
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {isOpen9 && (
                    <p className={styles.error}>Please select an option</p>
                  )}
                </div>

                {/* BATHROOM */}
                {/* BATHROOM */}
                {/* BATHROOM */}
                {/* BATHROOM */}
                {/* BATHROOM */}
                {/* BATHROOM */}
                {/* BATHROOM */}
                {/* BATHROOM */}

                <div className={styles.bathroomsDiv}>
                  <div className={styles.name}>
                    <h4>Bathrooms*</h4>
                  </div>

                  <div>
                    <div
                      onClick={handleSelectBathRooms}
                      className={styles.select}
                    >
                      <>{selectBathRoomsValue === "" && <p>Select</p>}</>

                      <>
                        {selectBathRoomsValue === 0 && (
                          <p>{selectBathRoomsValue}</p>
                        )}
                      </>

                      <>
                        {selectBathRoomsValue === 1 && (
                          <p>{selectBathRoomsValue}</p>
                        )}
                      </>

                      <>
                        {selectBathRoomsValue === 2 && (
                          <p>{selectBathRoomsValue}</p>
                        )}
                      </>

                      <>
                        {selectBathRoomsValue === 3 && (
                          <p>{selectBathRoomsValue}</p>
                        )}
                      </>

                      <>
                        {selectBathRoomsValue === 4 && (
                          <p>{selectBathRoomsValue}</p>
                        )}
                      </>

                      <>
                        {selectBathRoomsValue === 5 && (
                          <p>{selectBathRoomsValue}</p>
                        )}
                      </>

                      {selectBathRooms ? <p>&uarr;</p> : <p> &darr;</p>}
                    </div>

                    {isOpen10 && (
                      <p className={styles.error}>Please select an option</p>
                    )}

                    {selectBathRooms && (
                      <div className={styles.selectBedRoomsMain}>
                        <div className={styles.selectBedRooms}>
                          <p
                            onClick={handleSelectedBathRoomsValueNone}
                            value={selectBathRoomsValue}
                          >
                            0
                          </p>

                          <p
                            onClick={handleSelectedBathRoomsValue1}
                            value={selectBathRoomsValue}
                          >
                            1
                          </p>

                          <p
                            onClick={handleSelectedBathRoomsValue2}
                            value={selectBathRoomsValue}
                          >
                            2
                          </p>

                          <p
                            onClick={handleSelectedBathRoomsValue3}
                            value={selectBathRoomsValue}
                          >
                            3
                          </p>
                          <p
                            onClick={handleSelectedBathRoomsValue4}
                            value={selectBathRoomsValue}
                          >
                            4
                          </p>
                          <p
                            onClick={handleSelectedBathRoomsValue5}
                            value={selectBathRoomsValue}
                          >
                            5
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {lightCommercial && (
            <div className={styles.oneTime2}>
              <div>
                <h3>Office Details</h3>
              </div>

              <div>
                <div className={styles.name}>
                  <h4>Square Feet*</h4>
                </div>

                <div className={styles.inputField}>
                  <input
                    type="text"
                    placeholder="2000"
                    value={lightCommercialOfficeSquareFeet}
                    onChange={handleLightCommercialOfficeSquareFeet}
                    className={styles.inputField}
                  />
                </div>
                {isOpen8 && (
                  <p className={styles.error}>Enter a valid square feet</p>
                )}
              </div>

              {/*LIGHT COMMERCIAL  OFFICES */}
              {/*LIGHT COMMERCIAL  OFFICES */}
              {/*LIGHT COMMERCIAL  OFFICES */}
              {/*LIGHT COMMERCIAL  OFFICES */}
              {/*LIGHT COMMERCIAL  OFFICES */}
              {/*LIGHT COMMERCIAL  OFFICES */}
              {/*LIGHT COMMERCIAL  OFFICES */}
              {/*LIGHT COMMERCIAL OFFICES */}

              <div className={styles.bedroomsDivMain}>
                <div className={styles.bedroomsDiv}>
                  <div className={styles.name}>
                    <h4>Offices*</h4>
                  </div>

                  <div>
                    <div
                      onClick={handleLightCommercialSelectedOffice}
                      className={styles.select}
                    >
                      <>
                        {lightCommercialSelectedOfficeValue === "" && (
                          <p>Select</p>
                        )}
                      </>

                      <>
                        {lightCommercialSelectedOfficeValue === 0 && (
                          <p>{lightCommercialSelectedOfficeValue}</p>
                        )}
                      </>

                      <>
                        {lightCommercialSelectedOfficeValue === 1 && (
                          <p>{lightCommercialSelectedOfficeValue}</p>
                        )}
                      </>

                      <>
                        {lightCommercialSelectedOfficeValue === 2 && (
                          <p>{lightCommercialSelectedOfficeValue}</p>
                        )}
                      </>

                      <>
                        {lightCommercialSelectedOfficeValue === 3 && (
                          <p>{lightCommercialSelectedOfficeValue}</p>
                        )}
                      </>

                      <>
                        {lightCommercialSelectedOfficeValue === 4 && (
                          <p>{lightCommercialSelectedOfficeValue}</p>
                        )}
                      </>

                      <>
                        {lightCommercialSelectedOfficeValue === 5 && (
                          <p>{lightCommercialSelectedOfficeValue}</p>
                        )}
                      </>

                      {selectedOffice ? <p>&uarr;</p> : <p> &darr;</p>}
                    </div>

                    {isOpen11 && (
                      <p className={styles.error}>Please select an option</p>
                    )}

                    {selectedOffice && (
                      <div className={styles.selectBedRoomsMain}>
                        <div className={styles.selectBedRooms}>
                          <p
                            onClick={lightCommercialSelectedOfficeValueNone}
                            value={lightCommercialSelectedOfficeValue}
                          >
                            0
                          </p>

                          <p
                            onClick={lightCommercialSelectedOfficeValue1}
                            value={lightCommercialSelectedOfficeValue}
                          >
                            1
                          </p>

                          <p
                            onClick={lightCommercialSelectedOfficeValue2}
                            value={lightCommercialSelectedOfficeValue}
                          >
                            2
                          </p>

                          <p
                            onClick={lightCommercialSelectedOfficeValue3}
                            value={lightCommercialSelectedOfficeValue}
                          >
                            3
                          </p>
                          <p
                            onClick={lightCommercialSelectedOfficeValue4}
                            value={lightCommercialSelectedOfficeValue}
                          >
                            4
                          </p>
                          <p
                            onClick={lightCommercialSelectedOfficeValue5}
                            value={lightCommercialSelectedOfficeValue}
                          >
                            5
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/*LIGHT COMMERCIAL  BATHROOM */}
                {/*LIGHT COMMERCIAL  BATHROOM */}
                {/*LIGHT COMMERCIAL  BATHROOM */}
                {/*LIGHT COMMERCIAL  BATHROOM */}
                {/*LIGHT COMMERCIAL  BATHROOM */}
                {/*LIGHT COMMERCIAL  BATHROOM */}
                {/*LIGHT COMMERCIAL  BATHROOM */}
                {/*LIGHT COMMERCIAL BATHROOM */}

                <div className={styles.bathroomsDiv}>
                  <div className={styles.name}>
                    <h4>Bathrooms*</h4>
                  </div>

                  <div>
                    <div
                      onClick={handleLightCommercialSelectedOfficeBathRooms}
                      className={styles.select}
                    >
                      <>
                        {lightCommercialSelectedOfficeBathRoomsValue === "" && (
                          <p>Select</p>
                        )}
                      </>

                      <>
                        {lightCommercialSelectedOfficeBathRoomsValue === 0 && (
                          <p>{lightCommercialSelectedOfficeBathRoomsValue}</p>
                        )}
                      </>

                      <>
                        {lightCommercialSelectedOfficeBathRoomsValue === 1 && (
                          <p>{lightCommercialSelectedOfficeBathRoomsValue}</p>
                        )}
                      </>

                      <>
                        {lightCommercialSelectedOfficeBathRoomsValue === 2 && (
                          <p>{lightCommercialSelectedOfficeBathRoomsValue}</p>
                        )}
                      </>

                      <>
                        {lightCommercialSelectedOfficeBathRoomsValue === 3 && (
                          <p>{lightCommercialSelectedOfficeBathRoomsValue}</p>
                        )}
                      </>

                      <>
                        {lightCommercialSelectedOfficeBathRoomsValue === 4 && (
                          <p>{lightCommercialSelectedOfficeBathRoomsValue}</p>
                        )}
                      </>

                      <>
                        {lightCommercialSelectedOfficeBathRoomsValue === 5 && (
                          <p>{lightCommercialSelectedOfficeBathRoomsValue}</p>
                        )}
                      </>

                      {selectedOfficeBathRooms ? <p>&uarr;</p> : <p> &darr;</p>}
                    </div>

                    {isOpen12 && (
                      <p className={styles.error}>Please select an option</p>
                    )}

                    {selectedOfficeBathRooms && (
                      <div className={styles.selectBedRoomsMain}>
                        <div className={styles.selectBedRooms}>
                          <p
                            onClick={
                              handlelightCommercialSelectedOfficeBathRoomsValueNone
                            }
                            value={lightCommercialSelectedOfficeBathRoomsValue}
                          >
                            0
                          </p>

                          <p
                            onClick={
                              handlelightCommercialSelectedOfficeBathRoomsValue1
                            }
                            value={lightCommercialSelectedOfficeBathRoomsValue}
                          >
                            1
                          </p>

                          <p
                            onClick={
                              handlelightCommercialSelectedOfficeBathRoomsValue2
                            }
                            value={lightCommercialSelectedOfficeBathRoomsValue}
                          >
                            2
                          </p>

                          <p
                            onClick={
                              handlelightCommercialSelectedOfficeBathRoomsValue3
                            }
                            value={lightCommercialSelectedOfficeBathRoomsValue}
                          >
                            3
                          </p>
                          <p
                            onClick={
                              handlelightCommercialSelectedOfficeBathRoomsValue4
                            }
                            value={lightCommercialSelectedOfficeBathRoomsValue}
                          >
                            4
                          </p>
                          <p
                            onClick={
                              handlelightCommercialSelectedOfficeBathRoomsValue5
                            }
                            value={lightCommercialSelectedOfficeBathRoomsValue}
                          >
                            5
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.type}>
                  <h4>Frequency of Cleaning*</h4>
                </div>
                <div className={styles.typeOfCleaning}>
                  <div className={styles.radioButton}>
                    <p
                      onClick={handleOneWeek}
                      className={oneWeek ? styles.radio2 : styles.radio}
                    ></p>

                    <p>Recurring</p>
                  </div>

                  <div className={styles.radioButton}>
                    <p
                      onClick={handleOneTimeClean}
                      className={oneTimeClean ? styles.radio2 : styles.radio}
                    ></p>

                    <p>One-Time Clean</p>
                  </div>
                </div>
              </div>

              {oneWeek && (
                <div>
                  <div className={styles.type}>
                    <h4>Frequency*</h4>
                  </div>

                  <div className={styles.typeOfCleaning2}>
                    <div className={styles.radioButton}>
                      <p
                        onClick={handleWeekly}
                        value={lightCommercialRecurring}
                        className={
                          lightCommercialRecurring === "weekly"
                            ? styles.radio2
                            : styles.radio
                        }
                      ></p>

                      <p>Weekly</p>
                    </div>

                    <div className={styles.radioButton}>
                      <p
                        onClick={handleOtherWeek}
                        value={lightCommercialRecurring}
                        className={
                          lightCommercialRecurring === "every Other Week"
                            ? styles.radio2
                            : styles.radio
                        }
                      ></p>

                      <p>Every Other Week</p>
                    </div>

                    <div className={styles.radioButton}>
                      <p
                        onClick={handle4Weeks}
                        value={lightCommercialRecurring}
                        className={
                          lightCommercialRecurring === "once In 4 Weeks"
                            ? styles.radio2
                            : styles.radio
                        }
                      ></p>

                      <p>Once Every 4 Weeks</p>
                    </div>
                  </div>
                </div>
              )}

              {oneTimeClean && (
                <div>
                  <div className={styles.type}>
                    <h4>Is this a move-in/move-out clean?*</h4>
                  </div>

                  <div className={styles.typeOfCleaning}>
                    <div className={styles.radioButton}>
                      <p
                        onClick={handleYes}
                        value={lightCommercialOneTimeClean}
                        className={
                          lightCommercialOneTimeClean === "yes"
                            ? styles.radio2
                            : styles.radio
                        }
                      ></p>

                      <p>Yes</p>
                    </div>

                    <div className={styles.radioButton}>
                      <p
                        onClick={handleNo}
                        value={lightCommercialOneTimeClean}
                        className={
                          lightCommercialOneTimeClean === "no"
                            ? styles.radio2
                            : styles.radio
                        }
                      ></p>

                      <p>No</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.fullMain}>
        <div>
          <img
            className={styles.image}
            src="https://i.pinimg.com/736x/49/dd/29/49dd29ae47323d64550d02d174cd765e.jpg"
          />
        </div>

        <div className={styles.full}>
          <h4>Our full house cleaning includes everything on this list:</h4>
        </div>

        <div className={styles.checkMarkFooterDiv}>
          <p className={styles.checkMarkFooter}>&#10004;</p>

          <p>Dust baseboards, light fixtures, furniture, sills</p>
        </div>

        <div className={styles.checkMarkFooterDiv}>
          <p className={styles.checkMarkFooter}>&#10004;</p>

          <p>Vacuum/Mop all floors, carpets, and stairs</p>
        </div>

        <div className={styles.checkMarkFooterDiv}>
          <p className={styles.checkMarkFooter}>&#10004;</p>

          <p>Clean showers, tubs, toilets, and sinks</p>
        </div>

        <div className={styles.checkMarkFooterDiv}>
          <p className={styles.checkMarkFooter}>&#10004;</p>

          <p>Clean mirrors, glass, counters, and tile</p>
        </div>

        <div className={styles.checkMarkFooterDiv}>
          <p className={styles.checkMarkFooter}>&#10004;</p>

          <p>Dust all furniture and furnishings</p>
        </div>

        <div className={styles.checkMarkFooterDiv}>
          <p className={styles.checkMarkFooter}>&#10004;</p>

          <p>And much more!</p>
        </div>
      </div>

      <div className={styles.privacy}>
        <p>
          By entering your email address, you agree to receive emails about
          services, updates or promotions, and you agree to the{" "}
          <span className={styles.span}>Terms</span> and{" "}
          <span className={styles.span}> Privacy Policy</span>. You may
          unsubscribe at any time.
        </p>
      </div>

      <form onClick={handleSubmitForm} className={styles.submitButton}>
        {!isOpenCheck ? <h4>Submit and Continue</h4> : <h4>Form Submitted</h4>}

        <p>&rarr;</p>
      </form>

      {formSubmit && (
        <p className={styles.error}>Please fill out the indicated parts</p>
      )}

      <div>
        <p className={styles.term}>
          No longer-term contracts. No pressure. Cancel anytime!
        </p>
      </div>
    </div>
  );
}
