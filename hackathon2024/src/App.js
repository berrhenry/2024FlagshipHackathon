import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { act, useEffect, useState } from 'react';

function App() {
  
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [calorie, setCalorie] = useState(0);
  const [fiber, setFiber] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbohydrates, setCarbohydrates] = useState(0);
  const [score, setScore] = useState(0);
  const [healthiness, setHealthiness] = useState(0);
  const [healthMsg, setHealthMsg] = useState([]);
  const [activityLevel, setActivityLevel] = useState(0);

  const [errorMsg, setErrorMsg] = useState("");
  const [showBanner, setShowBanner] = useState(true);

  const checkValues = () => {
    var msg = "";
    if (gender === "") {
      msg = msg.concat("Please select a gender");
    }
    if (age < 9 || age > 100) {
      msg = msg.concat("Please input valid age(9-100)\n");
    }
    if (height < 120 || height > 220) {
      msg = msg.concat("Please input valid height(120-220)\n");
    }
    if (weight < 20 || weight > 200) {
      msg = msg.concat("Please input valid weight(20-200)\n")
    }
    if (calorie < 500 || calorie > 10000) {
      msg = msg.concat("Please input valid calorie(500-10000)\n");
    }
    if (protein < 10 || protein > 200) {
      msg = msg.concat("Please input valid protein(10-200)\n");
    }
    if (carbohydrates < 50 || carbohydrates > 1000) {
      msg = msg.concat("Please input valid carbohydrates(50-1000)\n");
    }
    if (fiber < 5 || fiber > 100) {
      msg = msg.concat("Please input valid fiber(5-100)\n");
    }
    if (activityLevel < 1 || activityLevel > 5) {
      msg = msg.concat("Please input valid activity level\n");
    }
    return msg;
  }

  /**
   * This function should calculate how healthy u are
   * I only used calories since websites like calories calculators only take in calories. 
   * 
   * For the calculation for the score, u might have to search something up, or just make up 
   * the numbers. They have to be belieable tho lol. 
   * 
   * This function should set score, healthiness and healthMsg, which would get displayed.
   * This could be set using the setter methods. Ex setScore(0)
   * 
   * I have coded score is out of a 100
   * healthiness would be a range of 5, where 5 is most healthy, and 1 and pretty much dead. 
   * 
   * healthMsg would be displayed with the other stuff, we could make more changes later. 
   * 
   * If u want, i could probably add exercise amount too, but it just might make it a bit more annoying 
   */
  const healthCalculation = () => {
    // User data: gender (M/F), age (9-100), height (120-220 cm), weight (20-200 kg), activity level (1-5)
    // Nutrients: calorie (500-10000 kal),protein (10-200 g), carbohydrates (50-1000g), fibre (5-100 g)
    // Result: score (100), healthiness (5), healthMsg: string[]

    /**
     * Sore will be calculated via weighted average comprised of:
     *    1- 0.2 BMI
     *    2- 0.35 BMR/TDEE/Calorie
     *    3- 0.25 Protein
     *    4- 0.1 Carbohydrates
     *    5- 0.1 Fibre
     * 
     * For BMI, they'll be a range, where if you fall away from that range, you'll get a lower bmiScore.
     * For (2-5) we'll calculate the percentage difference between the ideal and recorded amounts (called nutrientNameScore).
     * We apply scaling to every thingScore (heavier scaling if weighting is smaller), then combine them.
     * 
     * 
     * Ideal BMI: weight (kg) / [height (m)]^2
     * bmiScore Will be capped at a minimum depending on activityLevel
     * 
     * Ideal BMR/TDEE/Calorie:
     *    - Men	BMR = (10 × weight (kg)) + (6.25 × height (cm)) – (5 × age (years)) + 5
     *    - Women	BMR = (10 × weight (kg)) + (6.25 × height (cm)) – (5 × age (years)) – 161
     * Then to find TDEE (Total Daily Energy Expenditure), we multiply with an activityFactor:
     *    - activityFactor: 1 => scalar: 1.2
     *    - activityFactor: 2 => scalar: 1.375
     *    - activityFactor: 3 => scalar: 1.55
     *    - activityFactor: 4 => scalar: 1.725
     *    - activityFactor: 5 => scalar: 1.9
     * 
     * Ideal Protein:
     *    - activityLevel <= 2: 0.8 × weight (kg)
     *    - 3 <= activityLevel <= 4: 1.2-1.6 x weight (kg)
     *    - activityLevel = 5: 1.6-2.0 x weight (kg)
     *    - If age > 70: 1.2 x weight
     * 
     * Ideal Carbohydrates: 0.25 * TDEE * (0.45-0.65)
     * 
     * Ideal Fiber: 
     *    - Males:
     *        - Ages 9-13     31 g
     *        - Ages 14-18    38 g
     *        - Ages 19-50    38 g
     *        - Ages 51+      30 g
     *    - Females:
     *        - Ages 9-13     26 g
     *        - Ages 14-18    26 g
     *        - Ages 19-50    25 g
     *        - Ages 51+      21 g
     * 
     * Combining the scores: They'll be a counter called sinCounter, where every time thingScore is below a certain threshold, 
     * sinCounter gets incremented by a weighted thing. Then, whatever sinCounter is means that healthinessScore will be capped.
     * 
     * 
     */

    /**
     * Health Messages:
     * 
     * They will depend purely on each individual thingScore, and will be push to an array.
     * 
     * They will look like "Your Fibre intake is too high/low! Ideal amount should be a-b"
     */

    // Checking that all the values are in range
    const msg = checkValues();
    if (msg !== "") {
      setErrorMsg(msg);
      setHealthiness(-1);
      return;
    }

    // The zero is a placeholder so that we can do activityFactor[activityLevel]
    let activityFactor = [0, 1.2, 1.375, 1.55, 1.725, 1.9];

    // Calculate idealWeight - This will be used in some formulas
    let idealWeight;
    let lowIdealWeight = 18.5 * Math.pow((height / 100), 2);
    let highIdealWeight = 24.9 * Math.pow((height / 100), 2);
    if (Math.abs(idealWeight - lowIdealWeight) < Math.abs(idealWeight - highIdealWeight)) {
      idealWeight = lowIdealWeight;
    } else {
      idealWeight = highIdealWeight;
    }

    // Calculating bmiIdeal, and bmiError
    let bmi = weight / ((height/100) * (height/100));
    let bmiError;
    if (bmi < 10) {
      bmiError = 90;           // 0-10
    } else if (bmi < 16) {
      bmiError = 75;           // 10-16
    } else if (bmi < 17) {
      bmiError = 60;           // 16-17
    } else if (bmi < 18) {
      bmiError = 45;           // 17-18
    } else if (bmi < 18.5) {
      bmiError = 30;           // 18-18.5
    } else if (bmi < 25) {
      bmiError = 0;            // 18.5-24.9
    } else if (bmi < 30) {
      if (activityLevel > 3) {
        bmiError = 20;
      } else {
        bmiError = 40;         // 25-29.9
      }
    } else {
      if (activityLevel >= 5) {
        bmiError = 20;
      } else if (activityLevel >= 3) {
        bmiError = 50;
      } else {
        bmiError = 80;           // 30+
      }
    }

  
    // Calculating idealCalorieIntake and calorieError
    let idealCalorieIntake;
    if (gender == "male") {
      idealCalorieIntake = ((13.397 * weight) + (4.799 * height) - (5.677 * age) + 88.362) * activityFactor[activityLevel];
      //((10 * idealWeight) + (6.25 * height) - (5 * age) + 5) * activityFactor[activityLevel];
    } else if (gender == "female") {
      idealCalorieIntake = ((9.247 * weight) + (3.098 * height) - (4.330 * age) + 447.593) * activityFactor[activityLevel];
      //((10 * idealWeight) + (6.25 * height) - (5 * age) - 161) * activityFactor[activityLevel];
    } else {
      throw new Error('This is not supossed to happen for idealCalorie calculation');
    }
    if (idealCalorieIntake < 5) {
      idealCalorieIntake = 500;
    }

    let calorieError = Math.min(100 * Math.abs(calorie - idealCalorieIntake) / idealCalorieIntake, 100);


    // Calculating idealProteinIntake and proteinScore
    let lowIdealProteinIntake = weight;
    let highIdealProteinIntake = weight;
    if (age < 70) {
      if (activityLevel <= 2) {
        lowIdealProteinIntake *= 0.8;
        highIdealProteinIntake *= 0.8;
      } else if (activityLevel <= 4) {
        lowIdealProteinIntake *= 1.2;
        highIdealProteinIntake *= 1.6;
      } else {
        lowIdealProteinIntake *= 1.6;
        highIdealProteinIntake *= 2.0;
      }
    } else {                        // They are over the age of 70
      lowIdealProteinIntake *= 1.0;
      highIdealProteinIntake *= 1.2;
    }

    let proteinError;
    if (lowIdealProteinIntake <= protein && highIdealProteinIntake >= protein) {
      proteinError = 100;
    } else {
      let lowProteinError = 100 * Math.abs(protein - lowIdealProteinIntake) / lowIdealProteinIntake;
      let highProteinError = 100 * Math.abs(protein - highIdealProteinIntake) / highIdealProteinIntake;

      proteinError = Math.min(lowProteinError, highProteinError);
      proteinError = Math.min(proteinError, 100);
    }

  
    // Calculating idealCarbohydrates and carbohydratesScore
    let lowIdealCarbohydrates = 0.25 * idealCalorieIntake * (0.45);
    let lowCarbohydratesError = 100 * Math.abs(carbohydrates - lowIdealCarbohydrates) / lowIdealCarbohydrates;
    
    let highIdealCarbohydrates = 0.25 * idealCalorieIntake * (0.65);
    let highCarbohydratesError = 100 * Math.abs(carbohydrates - highIdealCarbohydrates) / highIdealCarbohydrates;

    let carbohydratesError = Math.min(lowCarbohydratesError, highCarbohydratesError);
    carbohydratesError = Math.min(carbohydratesError, 100);


    // Calculating idealFiber and fiberScore
    let idealFiber;
    if (gender == 'male') {
      if (age <= 13) {
        idealFiber = 31;
      } else if (age <= 18) {
        idealFiber = 38;
      } else if (age <= 50) {
        idealFiber = 38;
      } else {
        idealFiber = 30;
      }
    } else if (gender == 'female') {
      if (age <= 13) {
        idealFiber = 26;
      } else if (age <= 18) {
        idealFiber = 26;
      } else if (age <= 50) {
        idealFiber = 25;
      } else {
        idealFiber = 21;
      }
    } else {
      throw new Error('This is not supossed to happen for idealFibre calculation');
    }
    let fiberError = Math.min(100 * Math.abs(fiber - idealFiber) / idealFiber, 100);


    // Finding out where to cap the finalScore (score)
    let sinCounter = 0;
    if (bmiError >= 70) sinCounter++;
    if (bmiError >= 50) sinCounter++;
    if (bmiError >= 30) sinCounter++;
    if (calorieError >= 60) sinCounter++;
    if (calorieError >= 40) sinCounter++;
    if (calorieError >= 20) sinCounter++;
    if (proteinError >= 60) sinCounter++;
    if (proteinError >= 30) sinCounter++;
    if (proteinError >= 10) sinCounter++;
    if (carbohydratesError >= 50) sinCounter++;
    if (fiberError >= 50) sinCounter++;
    if (fiberError >= 25) sinCounter++;

    let maxScore = 100 - 10 * sinCounter;

    let score = 100 - (0.2 * bmiError + 0.35 * calorieError + 0.25 * proteinError + 0.1 * carbohydratesError + 0.1 * fiberError);
    score = Math.min(score, maxScore);
    score = Math.max(score, 0);
    setScore(Math.floor(score));
    
    if (0 <= score && score <= 20) {
      setHealthiness(1)
    } else if (score <= 40) {
      setHealthiness(2)
    } else if (score <= 60) {
      setHealthiness(3)
    } else if (score <= 80) {
      setHealthiness(4)
    } else if (score <= 100) {
      setHealthiness(5)
    }


    // Filling out healthMsgTemp[]: string
    let healthMsgTemp = [];
    if (bmi < 18.5) {
      healthMsgTemp.push('You are underweight! Your ideal weight should be betewen ' + lowIdealWeight + ' kg and ' + highIdealWeight + ' kg.');
    } else if (bmi > 30) {
      healthMsgTemp.push('You are overweight! Your ideal weight should be betewen ' + lowIdealWeight + ' kg and ' + highIdealWeight + ' kg.');
    }
    if (calorieError > 30) {
      if (calorie < idealCalorieIntake) {
        healthMsgTemp.push('You are eating too little! Your ideal calorie intake should be approximately ' + idealCalorieIntake + ' cal.');
      } else if (calorie > idealCalorieIntake){
        healthMsgTemp.push('You are eating too much! Your ideal calorie intake should be approximately ' + idealCalorieIntake + ' cal.');
      } else {
        throw new Error('This is not supossed to happen for calories heathMsgTemp');
      }
    }
    if (proteinError > 30) {
      if (protein < lowIdealProteinIntake) {
        healthMsgTemp.push('You are not consuming enough protein! Your ideal protein intake should be between ' + lowIdealProteinIntake + ' g and ' + highIdealProteinIntake + ' g.');
      } else if (protein > highIdealProteinIntake){
        healthMsgTemp.push('You are consuming too much protein! Your ideal protein intake should be between ' + lowIdealProteinIntake + ' g and ' + highIdealProteinIntake + ' g.');
      } else {
        throw new Error('This is not supossed to happen for protein heathMsgTemp');
      }
    }
    if (carbohydratesError > 30) {
      if (carbohydrates < lowIdealCarbohydrates) {
        healthMsgTemp.push('You are eating too little Carbohydrates! Your ideal Carbohydrate intake should be between ' + lowIdealCarbohydrates  + ' g and ' + highIdealCarbohydrates + ' g.');
      } else if (carbohydrates > highIdealCarbohydrates) {
        healthMsgTemp.push('You are eating too much Carbohydrates! Your ideal Carbohydrate intake should be between ' + lowIdealCarbohydrates  + ' g and ' + highIdealCarbohydrates + ' g.');
      } else {
        throw new Error('This is not supossed to happen for carbohydrates heathMsgTemp');
      }
    }
    if (fiberError > 40) {
      if (fiber < idealFiber) {
        healthMsgTemp.push('You are not consuming enough fiber! You should consume approximately ' + idealFiber + ' g of fiber.');
      } else if (fiber > idealFiber) {
        healthMsgTemp.push('You are consuming too much fiber! You should consume approximately ' + idealFiber + ' g of fiber.');
      } else {
        throw new Error('This is not supossed to happen for fiber heathMsgTemp');
      }
    }
  }

  const rateHealth = () => {
    if (healthiness === 1) {
      return (<h4>Very Unhealthy 😡</h4>);
    }
    else if (healthiness === 2) {
      return (<h4>Unhealthy 😟</h4>);
    }
    else if (healthiness === 3) {
      return (<h4>Normal 😐</h4>);
    }
    else if (healthiness === 4) {
      return (<h4>Healthy! 🙂</h4>);
    }
    else if (healthiness === 5) {
      return (<h4>Very Healthy! 😃</h4>);
    }
    return (<></>);
  }

  /**
   * 
   */
  const renderHealth = () => {
    if (healthiness === 0) {
      return (<></>);
    }
    if (healthiness === -1) {
      return (
        <>
           <div className='contanier-lg text-light p-5 border rounded text-center'>
            <div className='text-wrap w-100'>
              {
               errorMsg.split('\n').map(msg => {
                return (
                  <p>{msg}</p>
                )
               })
              }
            </div>
           </div>
        </>);
    }
    return (
    <>
       <div className='contanier-lg text-light p-5 border rounded text-center'>
        {rateHealth()}
        <h4>Your Score: {score}/100</h4>
        <div className='text-wrap w-100'>
          {
            healthMsg.map(msg => {
              return (
                <>
                  <p>{msg}</p>
                </>
              )
            })
          }
        </div>
       </div>
    </>);
  }

  /**
   * 
   */
  const renderGenderButtons = () => {
    return (
      <> 
        {renderMale()}
        {renderFemale()}
      </>
    )
  } 

  const renderMale = () => {
    if (gender === 'male') {
      return (<button className='btn btn-primary disabled'>Male ♂️</button>)
    }
    else {
      return (<button className='btn btn-primary' onClick={() => setGender("male")}>Male ♂️</button>)
    }
  }

  const renderFemale = () => {
    if (gender === 'female') {
      return (<button className='btn btn-primary disabled'>Female ♀️</button>);
    }
    else {
      return (<button className='btn btn-primary' onClick={() => setGender("female")}>Female ♀️</button>);
    }
  }

  const footBanner = () => {
    if (showBanner) {
      return (
      <>
      <div className='fixed-bottom banner-height text-center' onClick={() => setShowBanner(false)}>
        <small className="form-text text-muted">This application uses rough estimations. This is not professional advice</small>
      </div>
      </>);
    }
    return (<></>);
  }

  return (
    <main className="h-100 bg-dark">
      <div className=' container-lg pt-5 overflow-auto'>
        <h1 className='text-light text-center'>
          Health score calculator
        </h1>
        <div className='contanier-lg d-flex text-light flex-column p-5'>
          <div className='container-md bg-transparent rounded h-25 d-flex flex-column w-75 mb-3'>
            <h3 className='text-center'>
              What is your gender
            </h3>
            <div className='d-flex flex-col justify-content-between pt-3'>
              {renderGenderButtons()}
            </div>
          </div>
          <div className='container-md bg-transparent rounded d-flex flex-column w-75 mb-5'>
            <h3 className='text-center'>
              How old are you?
            </h3>
            <label for="age">Age:</label>
            <input type="number" className="form-control" id="age" placeholder="Enter age" onChange={e => setAge(e.target.valueAsNumber)}></input>
          </div>
          <div className='container-md bg-transparent rounded d-flex flex-column w-75 mb-5'>
            <h3 className='text-center'>
              How much do you weigh?
            </h3>
            <label for="weight">weight:</label>
            <input type="number" className="form-control" id="weight" placeholder="Enter weight" onChange={e => setWeight(e.target.valueAsNumber)}></input>
          </div>
          <div className='container-md bg-transparent rounded d-flex flex-column w-75 mb-5'>
            <h3 className='text-center'>
              How tall are you?
            </h3>
            <label for="height">height:</label>
            <input type="number" className="form-control" id="height" placeholder="Enter height in cm" onChange={e => setHeight(e.target.valueAsNumber)}></input>
          </div>
          <div className='container-md bg-transparent rounded d-flex flex-column w-75 mb-5'>
            <h3 className='text-center'>
              What is your average calorie intake?
            </h3>
            <label for="calorie">calorie:</label>
            <input type="number" className="form-control" id="calorie" placeholder="Enter calorie" onChange={e => setCalorie(e.target.valueAsNumber)}></input>
          </div>
          <div className='container-md bg-transparent rounded d-flex flex-column w-75 mb-5'>
            <h3 className='text-center'>
              What is your average protein intake?
            </h3>
            <label for="protein">protein:</label>
            <input type="number" className="form-control" id="protein" placeholder="Enter Protein" onChange={e => setProtein(e.target.valueAsNumber)}></input>
          </div>
          <div className='container-md bg-transparent rounded d-flex flex-column w-75 mb-5'>
            <h3 className='text-center'>
              What is your average fiber intake?
            </h3>
            <label for="fiber">fiber:</label>
            <input type="number" className="form-control" id="fiber" placeholder="Enter fiber" onChange={e => setFiber(e.target.valueAsNumber)}></input>
          </div>
          <div className='container-md bg-transparent rounded d-flex flex-column w-75 mb-5'>
            <h3 className='text-center'>
              What is your average carbohydrate intake?
            </h3>
            <label for="carbohydrate">carbohydrate:</label>
            <input type="number" className="form-control" id="carbohydrate" placeholder="Enter carbohydrate (g)" onChange={e => setCarbohydrates(e.target.valueAsNumber)}></input>
          </div>
          <div className='container-md bg-transparent rounded d-flex flex-column w-75 mb-5'>
            <h3 className='text-center'>
              How much activity do you do from 1-5?
            </h3>
            <label for="activityLevel">activity level:</label>
            <input type="number" className="form-control" id="activityLevel" placeholder="1-5" onChange={e => {
              if (e.target.valueAsNumber >= 1 && e.target.valueAsNumber <= 5) {
                setActivityLevel(e.target.valueAsNumber);
              }
            }}></input>
          </div>
          <button className='btn btn-primary mb-5' onClick={() => healthCalculation()}>
            Calculate Score!
          </button>
          {renderHealth()}
        </div>
      </div>
      {footBanner()}
    </main>
  );
}

export default App;
