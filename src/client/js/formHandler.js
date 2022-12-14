async function handleSubmit(event) {
  event.preventDefault();
  console.log("Hello");

  //encodeURIComponent convert a string to a valid string for url (adds %20 for spaces automatically)
  const city = document.getElementById("city").value;

  let date = document.getElementById("date").value;

  if (city.length < 1) {
    alert("City cannot be empty");
    return;
  }
  if (date.length < 1) {
    alert("Date cannot be empty");
    return;
  }

  //get remaining days
  const days = Client.calculateDays(date);
  //create object to pass to backend
  const data = {
    date: date,
    city: city,
    days: days,
  };
  try {
    //call backend
    return await geonameAPI("http://localhost:8081/weather", data).then(
      function (data) {
        if (data == "City not found") {
          return document
            .getElementById("valid-city")
            .classList.remove("hidden");
        } else {
          document.getElementById("valid-city").classList.add("hidden");
        }
        //then update UI
        updateUI(data);
        //if trip exists in localstorage then remove it and add new one
        if (localStorage.getItem("trip")) localStorage.removeItem("trip");
        //save it to localstorage
        localStorage.setItem("trip", JSON.stringify(data));
      }
    );
  } catch (error) {
    console.log(error);
  }
}

const geonameAPI = async (endPoint = "", requestedOption = {}) => {
  const response = await fetch(endPoint, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestedOption),
  });
  // check if there is no result with entered city
  if (response.status == 404) {
    console.log("Not found");
    return "City not found";
  }
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("An error occured " + error);
  }
};

const updateUI = (result) => {
  //show trip result container and hide no trips text
  document.getElementById("not-found").classList.add("hidden");
  document.getElementById("trip-content").classList.remove("hidden");

  console.log(result);
  document.getElementById(
    "trip-title"
  ).innerText = `My trip to: ${result.city}, ${result.country} Departing: ${result.date}`;
  document.getElementById(
    "rem-date"
  ).innerText = `${result.city}, ${result.country} is ${result.days} days away`;

  if (result.temp) {
    document.getElementById(
      "weather"
    ).innerHTML = `Typical weather for arrival is: ${result.temp} ${result.description} <br/> <span>Sunrise at: ${result.sunrise}</span> <span>Sunset at: ${result.sunset}`;
  } else {
    document.getElementById(
      "weather"
    ).innerHTML = `Typical weather for arrival is: Highest temperature: ${result.high} and lowest temperature: ${result.low} <br/> ${result.description} `;
  }
  //if there is an image url then change placeholder image
  if (result.imgURL) {
    document.getElementById("trip-img").src = `${result.imgURL}`;
  }
};

const loadTrip = () => {
  //if there is a trip then update the UI with it
  if (localStorage.getItem("trip")) {
    //convert JSON into an object so that we can pass it to updateUI function
    const result = JSON.parse(localStorage.getItem("trip"));
    updateUI(result);
  }
};
const removeTrip = (event) => {
  event.preventDefault();
  if (confirm("Are you sure you want to remove this trip?")) {
    document.getElementById("not-found").classList.remove("hidden");
    document.getElementById("trip-content").classList.add("hidden");
    localStorage.removeItem("trip");
  }
};
export { handleSubmit, removeTrip, loadTrip };
