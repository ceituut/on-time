import { useState , useEffect } from 'react'
import Timer from './timer'
import AddSet from './addSet'
import AddTime from './addTime'
import "./style.css"
function App() {
  const [times , setTimes] = useState(
    [
      {
        name : "Daneshkade" ,
        background: "#ccc" ,
        times : ["7:35" , "8:40" , "9:05" , "9:55" , "10:35" , "11:20" , "11:50" , "12:20" ,
        "12:50" , "13:20" , "13:40" , "14:10" , "14:50" , "15:30" , "15:50" , "16:10" ,
        "16:25" , "16:45" , "17:05"
      ]
      } , 
      {
        name:"UUT" ,
        background : "yellow" , 
        times : ["8:20" , "8:45" , "9:35" , "10:15" , "11:00" , "11:30" , "12:00" , "12:30" ,
        "13:00" , "13:20" , "13:50" , "14:30" , "15:10" , "15:30" , "15:50" , "16:05" ,
        "16:25" , "16:45" , "17:40" , "18:15" , "19:10"
      ]
      }
    ]
  )
  const [activeTimer , setactiveTimer] = useState(0)
  const [addTimeWindow , setAddtimeWindow ] = useState(false)
  const [addSetWindow , setAddSetWindow] = useState(false)
  const [remaning , setRemaining] = useState(0) ;
  function prevTimer(e) {
    if (activeTimer !== 0)
    setactiveTimer(activeTimer - 1) ;
  }
  
  function nextTimer(e) {
    if (activeTimer + 1 < times.length) {
      setactiveTimer(activeTimer + 1)
    }
  }

  function showAddSet(e) {
    closeModal()
    setAddSetWindow(true)
  }

  function showAddTime(e) {
    closeModal()
    setAddtimeWindow(true)
  }

  function closeModal(e) {
    setAddSetWindow(false)
    setAddtimeWindow(false)
  }

  function addNewSet(timeset) {
    const newTimes = [...times]
    newTimes.push(timeset)
    setTimes(newTimes)
  }

  function addNewTime(time) {
    const [hour , min] = time.split(":") ;
    const currentTimes = times[activeTimer].times ;
    let len = currentTimes.length ;
    if (len > 0) {
      const [lastHour , lastMin] = currentTimes[len-1].split(":") ;
      if ((hour * 60) + parseInt(min) > (lastHour * 60) + parseInt(lastMin)) {
        currentTimes.push(time);
      }
      else {
        for (let i = 0 ; i < len; i ++) {
          const [targetHour , targetMin] = currentTimes[i].split(":") ;
          if ((hour * 60) + parseInt(min) === (targetHour * 60) + parseInt(targetMin)) {
            // Do nothing
            break ;
          }
          else if ((hour * 60) + parseInt(min) < (targetHour * 60) + parseInt(targetMin)) {
            currentTimes.splice(i , 0 , time) ;
            break ;
          }
        }
      }
    }
    // if there is no time
    else {
      currentTimes.push(time)
    }
    const newTime = [...times] ;
    newTime.times = currentTimes ;
    setTimes(newTime);
  }

  function remainingTime() {
    const today = new Date() ;
    const hour = today.getHours() ;
    const min = today.getMinutes() ;
    const second = today.getSeconds() ;
    const [target , index] = closestTime(hour , min) ;
    if (target == -1) {
        return [-1 , -1] ;
    }
    else {
        const [targetHour , targetMin] = target.split(":") ;
        const remainingTime = ((targetHour * 60) + parseInt(targetMin) - (hour * 60) - parseInt(min)) * 60 - second;
        return [remainingTime , index ];
    }
}

function closestTime(hour , min){
    const timeList = times[activeTimer].times ;
    const total = (hour * 60) + parseInt(min) ;
    for (let i = 0 ; i < timeList.length ; i ++) {
        const [targetHour , targetMin] = timeList[i].split(":") ;
        const target = (targetHour * 60) + parseInt(targetMin) ;
        if (total < target) {
            return [timeList[i] , i]
        }
        else if (total == target && i < timeList.length-1) {
            return [timeList[i+1] , i + 1]
        }
        else if (i == timeList.length && total < target) {
            return [timeList[i] , i]
        }
    }
    return [-1 , -1] ;
}

useEffect(() => {
  setRemaining(remainingTime())
  const timer = setInterval(() => {
    setRemaining(remainingTime())
    console.log(activeTimer)
  }, 1000);

  return () => {
    clearInterval(timer)
  }
}, [activeTimer])


  let modal = "";
  if (addSetWindow) {
    modal = <AddSet close={closeModal} addNewSet={addNewSet}/>
  }
  else if (addTimeWindow) {
    modal = <AddTime close={closeModal} addNewTime={addNewTime}/>
  }

  return (
    <div>
      <h1>On-Time: Never miss any buss again</h1>
      <button onClick={prevTimer} disabled={activeTimer == 0}>previous</button>
      <button onClick={nextTimer} disabled={activeTimer + 1 == times.length}>next</button>
      <button onClick={showAddSet}>add new set</button>
      <button onClick={showAddTime}>add time</button>
      <Timer timer = {times[activeTimer]} remaining = {remaning[0]} timeIndex = {remaning[1]}/>
      {modal}
    </div>
  )
}

export default App
