import { useState } from "react";
import axios from "axios";
import styles from "./Main.module.css";
import Modal from "./Modal/Modal.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Main() {
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
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

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
  function handleOneWeek() {
    setOneWeek(true);
    setOneTimeClean(false);
  }
  function handleOneTimeClean() {
    setOneTimeClean(true);
    setOneWeek(false);
  }
  function handleSelectBedRooms() {
    setSelectBedRooms((is) => !is);
    setSelectBathRooms(false);
  }
  function handleSelectBathRooms() {
    setSelectBathRooms((is) => !is);
    setSelectBedRooms(false);
  }
  function handleLightCommercialSelectedOffice() {
    setSelectedOffice((is) => !is);
    setSelectedOfficeBathRooms(false);
  }
  function handleLightCommercialSelectedOfficeBathRooms() {
    setSelectedOfficeBathRooms((is) => !is);
    setSelectedOffice(false);
  }

  const setBedroom = (v) => {
    setSelectBedRoomsValue(v);
    setSelectBedRooms(false);
    setIsOpen9(false);
  };
  const setBathroom = (v) => {
    setSelectBathRoomsValue(v);
    setSelectBathRooms(false);
    setIsOpen10(false);
  };
  const setOffice = (v) => {
    setLightCommercialSelectedOfficeValue(v);
    setSelectedOffice(false);
    setIsOpen11(false);
  };
  const setOffBath = (v) => {
    setLightCommercialSelectedOfficeBathRoomsValue(v);
    setSelectedOfficeBathRooms(false);
    setIsOpen12(false);
  };

  function handleWeekly() {
    setLightCommercialRecurring("weekly");
    setLightCommercialOneTimeClean("");
  }
  function handleOtherWeek() {
    setLightCommercialRecurring("every Other Week");
    setLightCommercialOneTimeClean("");
  }
  function handle4Weeks() {
    setLightCommercialRecurring("once In 4 Weeks");
    setLightCommercialOneTimeClean("");
  }
  function handleYes() {
    setLightCommercialOneTimeClean("yes");
    setLightCommercialRecurring("");
  }
  function handleNo() {
    setLightCommercialOneTimeClean("no");
    setLightCommercialRecurring("");
  }

  function handleTextMeMessages() {
    setToggleRadio((is) => !is);
    setTextMeMessages(
      !toggleRadio
        ? "Yes send me service reminders"
        : "No don't send me service reminders",
    );
  }

  function validate() {
    let valid = true;
    if (!firstName) {
      setIsOpen1(true);
      valid = false;
    }
    if (!lastName) {
      setIsOpen2(true);
      valid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setIsOpen3(true);
      valid = false;
    }
    if (!phoneNumber) {
      setIsOpen4(true);
      valid = false;
    }
    if (!zipCode) {
      setIsOpen5(true);
      valid = false;
    }
    if (!servicesAddress) {
      setIsOpen6(true);
      valid = false;
    }
    if (residential && oneTime && !residentialHomeSquareFeet) {
      setIsOpen7(true);
      valid = false;
    }
    if (lightCommercial && !lightCommercialOfficeSquareFeet) {
      setIsOpen8(true);
      valid = false;
    }
    return valid;
  }

  async function handleSubmitForm() {
    setSubmitError("");

    if (!validate()) {
      setFormSubmit(true);
      return;
    }

    const cleaningType = residential ? "residential" : "light_commercial";
    let frequency = "recurring";
    if (residential && oneTime)
      frequency = moveInOut ? "one_time" : "move_in_out";

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/leads`, {
        firstName,
        lastName,
        email,
        phoneNumber,
        textMeMessages,
        zipCode,
        servicesAddress,
        apartmentOrSuite,
        cleaningType,
        frequency,
        residentialHomeSquareFeet,
        selectBedRoomsValue,
        selectBathRoomsValue,
        lightCommercialRecurring,
        lightCommercialOfficeSquareFeet,
        lightCommercialSelectedOfficeValue,
        lightCommercialSelectedOfficeBathRoomsValue,
        lightCommercialOneTimeClean,
      });

      setIsOpenCheck(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setZipCode("");
      setServiceAddress("");
      setApartmentOrSuite("");
      setResidentialHomeSquareFeet("");
      setLightCommercialOfficeSquareFeet("");
      setSelectBedRoomsValue("");
      setSelectBathRoomsValue("");
      setLightCommercialSelectedOfficeValue("");
      setLightCommercialSelectedOfficeBathRoomsValue("");
      setFormSubmit(false);
    } catch (err) {
      console.error(err);
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setSubmitError(errMsg);
    } finally {
      setLoading(false);
    }
  }

  const SelectDropdown = ({
    label,
    value,
    isOpen,
    onToggle,
    onSelect,
    errorOpen,
    errorMsg,
  }) => (
    <div>
      <div className={styles.name}>
        <h4>{label}*</h4>
      </div>
      <div onClick={onToggle} className={styles.select}>
        <p>{value === "" ? "Select" : value}</p>
        {isOpen ? <p>&uarr;</p> : <p>&darr;</p>}
      </div>
      {errorOpen && <p className={styles.error}>{errorMsg}</p>}
      {isOpen && (
        <div className={styles.selectBedRoomsMain}>
          <div className={styles.selectBedRooms}>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <p key={n} onClick={() => onSelect(n)}>
                {n}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );

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
            <p className={styles.checkMark}>&#10004;</p>
          ) : (
            <p className={styles.checkMark1}></p>
          )}
        </div>

        <div className={styles.started}>
          <p>Let&apos;s get started!</p>
        </div>

        <div>
          <div className={styles.star}>
            <p>*Indicates a required field</p>
          </div>

          <div>
            <div className={styles.name}>
              <h4>First Name*</h4>
            </div>
            <input
              type="text"
              placeholder="ex. IziBest"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setIsOpen1(false);
              }}
              className={styles.inputField}
            />
            {isOpen1 && <p className={styles.error}>Enter the first name</p>}
          </div>

          <div>
            <div className={styles.name}>
              <h4>Last Name*</h4>
            </div>
            <input
              type="text"
              placeholder="ex. Interior"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setIsOpen2(false);
              }}
              className={styles.inputField}
            />
            {isOpen2 && <p className={styles.error}>Enter the last name</p>}
          </div>

          <div>
            <div className={styles.name}>
              <h4>Email*</h4>
            </div>
            <input
              type="email"
              placeholder="ex. izibestinterior1@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsOpen3(false);
              }}
              className={styles.inputField}
            />
            {isOpen3 && (
              <p className={styles.error}>Enter a valid email address</p>
            )}
          </div>

          <div>
            <div className={styles.name}>
              <h4>Phone Number*</h4>
            </div>
            <input
              type="tel"
              placeholder="ex. +234 803 058 8774"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setIsOpen4(false);
              }}
              className={styles.inputField}
            />
            {isOpen4 && <p className={styles.error}>Enter the phone number</p>}
          </div>

          <div className={styles.yesDiv}>
            <div className={styles.checkbox}>
              <input
                checked={toggleRadio}
                onChange={handleTextMeMessages}
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
              and/or MMS messages from IziMaid. Message & data rates may apply.
              Reply STOP to opt out.
            </p>
          </div>

          <div>
            <div className={styles.name}>
              <h4>ZIP Code*</h4>
            </div>
            <input
              type="text"
              placeholder="ex. 900001"
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value);
                setIsOpen5(false);
              }}
              className={styles.inputField}
            />
            {isOpen5 && <p className={styles.error}>Enter a valid ZIP code</p>}
          </div>

          <div>
            <div className={styles.name}>
              <h4>Service Address*</h4>
            </div>
            <input
              type="text"
              placeholder="ex. 1234 Example St Abuja, FCT"
              value={servicesAddress}
              onChange={(e) => {
                setServiceAddress(e.target.value);
                setIsOpen6(false);
              }}
              className={styles.inputField}
            />
            {isOpen6 && (
              <p className={styles.error}>Enter a valid service address</p>
            )}
          </div>

          <div>
            <div className={styles.name}>
              <h4>Apartment/Suite (optional)</h4>
            </div>
            <input
              type="text"
              placeholder="ex. Suite A, Unit 6B"
              value={apartmentOrSuite}
              onChange={(e) => setApartmentOrSuite(e.target.value)}
              className={styles.inputField}
            />
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

          {residential && oneTime && (
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
                <input
                  type="text"
                  placeholder="2000"
                  value={residentialHomeSquareFeet}
                  onChange={(e) => {
                    setResidentialHomeSquareFeet(e.target.value);
                    setIsOpen7(false);
                  }}
                  className={styles.inputField}
                />
                {isOpen7 && (
                  <p className={styles.error}>Enter a valid square feet</p>
                )}
              </div>
              <div className={styles.bedroomsDivMain}>
                <div className={styles.bedroomsDiv}>
                  <SelectDropdown
                    label="Bedrooms"
                    value={selectBedRoomsValue}
                    isOpen={selectBedRooms}
                    onToggle={handleSelectBedRooms}
                    onSelect={setBedroom}
                    errorOpen={isOpen9}
                    errorMsg="Please select an option"
                  />
                </div>
                <div className={styles.bathroomsDiv}>
                  <SelectDropdown
                    label="Bathrooms"
                    value={selectBathRoomsValue}
                    isOpen={selectBathRooms}
                    onToggle={handleSelectBathRooms}
                    onSelect={setBathroom}
                    errorOpen={isOpen10}
                    errorMsg="Please select an option"
                  />
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
                <input
                  type="text"
                  placeholder="2000"
                  value={lightCommercialOfficeSquareFeet}
                  onChange={(e) => {
                    setLightCommercialOfficeSquareFeet(e.target.value);
                    setIsOpen8(false);
                  }}
                  className={styles.inputField}
                />
                {isOpen8 && (
                  <p className={styles.error}>Enter a valid square feet</p>
                )}
              </div>
              <div className={styles.bedroomsDivMain}>
                <div className={styles.bedroomsDiv}>
                  <SelectDropdown
                    label="Offices"
                    value={lightCommercialSelectedOfficeValue}
                    isOpen={selectedOffice}
                    onToggle={handleLightCommercialSelectedOffice}
                    onSelect={setOffice}
                    errorOpen={isOpen11}
                    errorMsg="Please select an option"
                  />
                </div>
                <div className={styles.bathroomsDiv}>
                  <SelectDropdown
                    label="Bathrooms"
                    value={lightCommercialSelectedOfficeBathRoomsValue}
                    isOpen={selectedOfficeBathRooms}
                    onToggle={handleLightCommercialSelectedOfficeBathRooms}
                    onSelect={setOffBath}
                    errorOpen={isOpen12}
                    errorMsg="Please select an option"
                  />
                </div>
              </div>

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

              {oneWeek && (
                <div>
                  <div className={styles.type}>
                    <h4>Frequency*</h4>
                  </div>
                  <div className={styles.typeOfCleaning2}>
                    {[
                      ["weekly", "Weekly"],
                      ["every Other Week", "Every Other Week"],
                      ["once In 4 Weeks", "Once Every 4 Weeks"],
                    ].map(([val, label]) => (
                      <div key={val} className={styles.radioButton}>
                        <p
                          onClick={() => setLightCommercialRecurring(val)}
                          className={
                            lightCommercialRecurring === val
                              ? styles.radio2
                              : styles.radio
                          }
                        ></p>
                        <p>{label}</p>
                      </div>
                    ))}
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
            alt="cleaning"
          />
        </div>
        <div className={styles.full}>
          <h4>Our full house cleaning includes everything on this list:</h4>
        </div>
        {[
          "Dust baseboards, light fixtures, furniture, sills",
          "Vacuum/Mop all floors, carpets, and stairs",
          "Clean showers, tubs, toilets, and sinks",
          "Clean mirrors, glass, counters, and tile",
          "Dust all furniture and furnishings",
          "And much more!",
        ].map((item) => (
          <div key={item} className={styles.checkMarkFooterDiv}>
            <p className={styles.checkMarkFooter}>&#10004;</p>
            <p>{item}</p>
          </div>
        ))}
      </div>

      <div className={styles.privacy}>
        <p>
          By entering your email address, you agree to receive emails about
          services, updates or promotions. You may unsubscribe at any time.
        </p>
      </div>

      <div onClick={handleSubmitForm} className={styles.submitButton}>
        {loading ? (
          <h4>Submitting...</h4>
        ) : !isOpenCheck ? (
          <h4>Submit and Continue</h4>
        ) : (
          <h4>Form Submitted</h4>
        )}
        <p>&rarr;</p>
      </div>

      {formSubmit && (
        <p className={styles.error}>Please fill out the indicated parts</p>
      )}
      <Modal message={submitError} onClose={() => setSubmitError("")} />

      <div>
        <p className={styles.term}>
          No longer-term contracts. No pressure. Cancel anytime!
        </p>
      </div>
    </div>
  );
}
