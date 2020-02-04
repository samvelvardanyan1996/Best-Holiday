/**
 * init data for tours, package-types and place-types(where stay)
 * tourId is commint from GET, and taking by php-code
 * check that tourNumber is accessible from here
 * console.log('calc_js', tourNumber) */

const tourInfo = [
  {
    name: "horseTour",
    price: 4200,
    days: 7,
    id: 1
  },
  {
    name: "walking",
    price: 2900,
    days: 7,
    id: 2
  },
  {
    name: "sightseeng",
    price: 3300,
    days: 7,
    id: 3
  },
  {
    name: "nagorno",
    price: 5400,
    days: 7,
    id: 4
  },
  {
    name: "weekend",
    price: 350,
    days: 3,
    id: 5
  },
  {
    name: "excursion",
    price: 1650,
    days: 5,
    id: 6
  }
];

const packTypes = [
  {
    id: "allInclusive",
    incPrice: 1000
  },
  {
    id: "allUltra",
    incPrice: 2000
  },
  {
    id: "allCrazzy",
    incPrice: 2000
  },
  {
    id: "noInclusive",
    incPrice: 0
  }
];

const placeTypes = [
  {
    id: "apartment",
    plcPrice: 50
  },
  {
    id: "private",
    plcPrice: 100
  },
  {
    id: "hotel",
    plcPrice: 150
  },
  {
    id: "noPlace",
    plcPrice: 0
  }
];

// constants for session naming
const DAY_GAP = `DayGapMoreThenFive`
const MONTH_GAP = `MonthGapMoreThenTwo`
const TRAVELERS_GAP = 'TravelerGapMoreThenThree'
const FIFTEEN_DISC = 15
const TEN_DISC = 10



function getDateValue(){
  const checkInDate = document.getElementById('checkin_date').value
  console.log('checkInDate->', checkInDate)
  return checkInDate
}

function compareDateValue(){
  const dateValue = getDateValue()
  const selDate = new Date(`${dateValue}`) ;
  const currDate = new Date();

  const monthDiff = moment(selDate).diff(currDate, "months") // , true 1.739874397
  console.log(`monthDiff-> ${monthDiff}`)
  const dayDiff = moment(selDate).diff(currDate, "days")
  console.log(`dayDiff-> ${dayDiff}`)  

  // when date is in past
  if(dayDiff < 5) {
    showLessDayMessage('add')
    sessionStorage.setItem(DAY_GAP, 'false');
  }else{
    showLessDayMessage('remove')
    sessionStorage.setItem(DAY_GAP, 'true');
  }

  if(monthDiff >=2){
    // showFifteenDiscountMessage()
    sessionStorage.setItem(MONTH_GAP, 'true');
  }else{
    sessionStorage.setItem(MONTH_GAP, 'false');
  }
}

$(document).on('changeDate', onChangeDate)

function onChangeDate(event) {
  // compareDateValue()
  calculate()
}

function showLessDayMessage(flag = 'add'){
  const minDateAvailable = moment().add(5, 'days').format('MM-DD-YYYY')
  const lessDayMessage = `Please, select date after ${minDateAvailable}`
  const formMessageTag = document.getElementById('form-message')
  if(flag === 'add') {
    formMessageTag.textContent = lessDayMessage
    // alert('trueeee')
  }else{
    formMessageTag.textContent = ''
    // alert('false')
  }
  
}

function showFifteenDiscountMessage(){
  alert(`You have ${FIFTEEN_DISC}% discount`)
}

function showTenDiscountMessage(){
  alert(`You have ${TEN_DISC}% discount`)
}

/** functions for calcutating tour-price */
function changePackBox(event) {
  //console.log(event.target.id);
  const packId = event.target.id;
  const packs = packTypes.filter(p => p.id !== packId);
  //console.log(packs);
  packs.forEach(p => {
    if (p.id !== "noInclusive")
      document.getElementById(`${p.id}`).checked = false;
  });
  //getInclusive()
  calculate();
}

function changePlaceBox(event) {
  const placeId = event.target.id;
  const places = placeTypes.filter(p => p.id !== placeId);
  places.forEach(p => {
    if (p.id !== "noPlace") document.getElementById(`${p.id}`).checked = false;
  });
  //getPlace()
  calculate();
}

function changeTravelers() {
  // getTravelers();
  //getAges()
  calculate();
}
//calculate()

function changeChildren() {
  const children = getChildren();
  //getAges()
  if (children > 0) {
    addAgeField(children);
  } else {
    removeAgeFields();
  }
  calculate();
}

function getAges() {
  let agesArray = [];
  const ageFields = document.getElementsByClassName("age");
  //console.log(ageFields.length);
  if (ageFields.length > 0) {
    for (let i = 0; i < ageFields.length; i++) {
      let age = ageFields[i];
      agesArray[i] = {
        id: age.id,
        age: age.value
      };
    }
  }
  //console.log(agesArray);
  return agesArray;
}


function getInclusive() {
  let inclusive = "noInclusive";
  const packBoxes = document.getElementsByName("packType");
  for (let i = 0; i < packBoxes.length; i++) {
    //console.log(packBoxes[i].checked);
    if (packBoxes[i].checked) {
      inclusive = packBoxes[i].id;
      break;
    }
  }
  //console.log(inclusive);
  const pack = packTypes.find(p => p.id === inclusive);
  console.log(pack.incPrice);
  return pack.incPrice;
}

function getPlace() {
  let place = "noPlace";
  const placeBoxes = document.getElementsByName("placeType");
  for (let i = 0; i < placeBoxes.length; i++) {
    if (placeBoxes[i].checked) {
      place = placeBoxes[i].id;
      break;
    }
  }
  //console.log(place);
  const placeType = placeTypes.find(p => p.id === place);
  //console.log(placeType.plcPrice);
  return placeType.plcPrice;
}

function getTravelers() {
  let travelers = document.getElementById("travelers").value;
  if (
    travelers <= 0 ||
    travelers == "" ||
    !Number.isInteger(Number(travelers))
  ) {
    travelers = 1;
    document.getElementById("travelers").value = travelers;
  }
  if(travelers >= 3) {
    // showTenDiscountMessage()
    sessionStorage.setItem(TRAVELERS_GAP, 'true');
  }else{
    sessionStorage.setItem(TRAVELERS_GAP, 'false');
  }
  console.log(travelers);
  return travelers;
}

function getChildren() {
  let children = document.getElementById("children").value;
  if (children <= 0 || children == "" || !Number.isInteger(Number(children))) {
    children = 0;
    document.getElementById("children").value = children;
  }
  console.log("getChildren->", children);
  return children;
}

function calculate() {
  const tour = tourInfo.find(t => t.id === tourNumber) || tourInfo[0];
  const travelers = getTravelers();
  // const children = getChildren();
  const inclusive = getInclusive();
  const agesArray = getAges();
  const placePrice = getPlace();
  console.log("placePrice", placePrice);
  compareDateValue()
  const monthGap = sessionStorage.getItem(MONTH_GAP)
  const dayGap = sessionStorage.getItem(DAY_GAP)
  const travelersGap = sessionStorage.getItem(TRAVELERS_GAP)

  let summaryWithDiscount = 0
  let discount = 0

  let summary = 0;
  let adultPrice = 0;
  let minorPrice = 0;
  let pricePerDayToShow = 0;
  if (inclusive > 0) {
    adultPrice = inclusive * tour.days * travelers;
    console.log(inclusive);
    console.log(tour);
    console.log(adultPrice);
    minorPrice = getChildrenPrice(
      agesArray,
      tour.days,
      inclusive,
      0,
      (flag = "isInclusion")
    );
    console.log("minorPrice-1", minorPrice);
  } else {
    adultPrice = tour.price * travelers + placePrice * tour.days * travelers;
    console.log(tour);
    console.log(adultPrice);
    minorPrice = getChildrenPrice(
      agesArray,
      tour.days,
      tour.price,
      placePrice,
      (flag = "notInclusion")
    );
    console.log("minorPrice-2", minorPrice);
  }

  if(monthGap == 'true') {
    discount += FIFTEEN_DISC
  }
  if(travelersGap == 'true') {
    discount += TEN_DISC
  }

  console.log(`-------------discount-----------`, discount)

  summary = adultPrice + minorPrice;
  summaryWithDiscount = summary - (summary*discount)/100
  pricePerDayToShow = summary/tour.days
  document.getElementById("summary").value = summaryWithDiscount // + ' / '+ summary;
  document.getElementById("discounts").textContent = discount;
  document.getElementById("day-price").textContent = Math.round(pricePerDayToShow);
  document.getElementById("day-nums").textContent = tour.days
}

function getChildrenPrice(agesArray, days, tourPrice, placePrice = 0, flag) {
  let childrenPrice = 0;
  if (agesArray.length > 0) {
    console.log(agesArray);

    for (let i = 0; i < agesArray.length; i++) {
      let child = agesArray[i];
      let childPrice = 0;
      if (child.age > 5 && child.age < 18) {
        if (flag === "isInclusion") {
          childPrice = (tourPrice * days + placePrice * days) / 2;
          // console.log('isInclusion----', flag, childPrice)
        } else {
          childPrice = tourPrice / 2;
        }
      }
      childrenPrice += childPrice;
    }
  }
  //console.log('childrenPrice', childrenPrice);
  return childrenPrice;
}

function getAgeWrapper() {
  return document.getElementById("ageWrap");
}

function addAgeField(qty) {
  removeAgeFields();
  const ageWrap = getAgeWrapper();
  for (let i = 0; i < qty; i++) {
    let filed = document.createElement("input");
    let childNum = i + 1;
    let childId = `id_${childNum}`;

    filed.classList.add("age");
    filed.setAttribute("type", "number");
    filed.setAttribute("id", `${childId}`);
    filed.setAttribute("value", 1);
    filed.setAttribute("min", 1);
    filed.setAttribute("max", 17);
    filed.addEventListener("change", function(e) {
      if (e.target && e.target.id === childId) {
        let value = e.target.value;
        console.log(childId, value);
        if (value >= 18) {
          value = 17;
        }
        if (value < 1) {
          value = 1;
        }
        document.getElementById(childId).value = value;
        calculate();
      }
    });
    let label = document.createElement("label");
    let text = document.createTextNode(`child age (${childNum})`);
    label.setAttribute("for", `${childId}`);
    label.classList.add("age-label");
    label.appendChild(text);
    label.appendChild(filed);
    ageWrap.appendChild(label);
  }
}

function removeAgeFields() {
  const ageWrap = getAgeWrapper();
  ageWrap.textContent = "";
}
calculate(); // caaling for the first time.
