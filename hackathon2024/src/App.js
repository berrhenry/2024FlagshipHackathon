import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';

function App() {
  
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [calorie, setCalorie] = useState(0);
  const [score, setScore] = useState(0);
  const [healthiness, setHealthiness] = useState(0);
  const [healthMsg, setHealthMsg] = useState("");

  const [showBanner, setShowBanner] = useState(true);

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
   * HealthMsg would be displayed with the other stuff, we could make more changes later. 
   * 
   * If u want, i could probably add exercise amount too, but it just might make it a bit more annoying 
   */
  const healthCalculation = () => {

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
    return (
    <>
       <div className='contanier-lg text-light p-5 border rounded text-center'>
        {rateHealth()}
        <h4>Your Score: {score}/100</h4>
        <div className='text-wrap w-100'>
          <div class="text-wrap">
            {healthMsg}
          </div>
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
        <small class="form-text text-muted">This application uses rough estimations. This is not professional advice</small>
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
            <input type="number" class="form-control" id="age" placeholder="Enter age" onChange={e => setAge(e.target.valueAsNumber)}></input>
          </div>
          <div className='container-md bg-transparent rounded d-flex flex-column w-75 mb-5'>
            <h3 className='text-center'>
              How much do you weigh?
            </h3>
            <label for="weight">weight:</label>
            <input type="number" class="form-control" id="weight" placeholder="Enter weight" onChange={e => setWeight(e.target.valueAsNumber)}></input>
          </div>
          <div className='container-md bg-transparent rounded d-flex flex-column w-75 mb-5'>
            <h3 className='text-center'>
              How tall are you?
            </h3>
            <label for="height">height:</label>
            <input type="number" class="form-control" id="height" placeholder="Enter height in cm" onChange={e => setHeight(e.target.valueAsNumber)}></input>
          </div>
          <div className='container-md bg-transparent rounded d-flex flex-column w-75 mb-5'>
            <h3 className='text-center'>
              What is your average calorie intake?
            </h3>
            <label for="calorie">calorie:</label>
            <input type="number" class="form-control" id="calorie" placeholder="Enter calorie" onChange={e => setCalorie(e.target.valueAsNumber)}></input>
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
