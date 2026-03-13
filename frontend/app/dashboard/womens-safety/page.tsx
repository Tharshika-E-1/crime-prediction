"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, ShieldAlert, Siren } from "lucide-react"
import { useState } from "react"
import dynamic from "next/dynamic"


const SafetyMap = dynamic(
  () => import("@/components/SafetyMap"),
  { ssr: false }
)

export default function WomensSafetyPage() {

const [start,setStart] = useState("")
const [destination,setDestination] = useState("")
const [arrival,setArrival] = useState("")
const [active,setActive] = useState(false)
const sendSOS = () => {

  navigator.geolocation.getCurrentPosition((pos)=>{

    const lat = pos.coords.latitude
    const lng = pos.coords.longitude

    fetch("http://127.0.0.1:5000/api/sos",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        user:"women_user",
        lat:lat,
        lng:lng,
        status:"active"
      })
    })

    alert("🚨 SOS Sent to Admin")

  })

}



const startJourney = () =>{
  setActive(true)
  alert("Safe Journey Check-in Started")
}

const completeJourney = () =>{
  setActive(false)
  alert("Journey Completed")
}
const useCurrentLocation = () => {

if (!navigator.geolocation) {
  alert("Geolocation not supported")
  return
}

navigator.geolocation.getCurrentPosition(
  (position) => {

    const lat = position.coords.latitude
    const lng = position.coords.longitude

    const location = `${lat}, ${lng}`

    setStart(location)

  },
  () => {
    alert("Unable to fetch location")
  }
)

}

return(

<div className="space-y-6">

<h1 className="text-3xl font-bold">Women's Safety</h1>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

{/* Safe Journey */}

<Card>

<CardHeader>
<CardTitle>Safe Journey Check-in</CardTitle>
</CardHeader>

<CardContent className="space-y-4">

<Input
placeholder="Start Location"
value={start}
onChange={(e)=>setStart(e.target.value)}
/>

<Button
variant="outline"
className="w-full flex items-center justify-center gap-2"
onClick={useCurrentLocation}
>

<MapPin className="w-4 h-4" />

Use Current Location

</Button>


<Input
placeholder="Destination"
value={destination}
onChange={(e)=>setDestination(e.target.value)}
/>
<p className="text-sm text-muted-foreground">
Time
</p>
<Input
type="time"
value={arrival}
onChange={(e)=>setArrival(e.target.value)}
/>
<p className="text-sm text-muted-foreground">
Date
</p>
<Input
type="date"
value={arrival}
onChange={(e)=>setArrival(e.target.value)}
/>


{!active ? (

<Button onClick={startJourney} className="w-full">
Start Safe Journey
</Button>

) : (

<Button variant="outline" onClick={completeJourney} className="w-full">
Journey Completed
</Button>

)}

<Button
onClick={sendSOS}
className="w-full bg-red-600 hover:bg-red-700 text-white"
>
<Siren className="mr-2 w-4 h-4" />
Emergency SOS
</Button>


<Button variant="outline" onClick={completeJourney} className="w-full">
Journey Completed
</Button>



<p className="text-sm text-muted-foreground">
Status : {active ? "Active" : "Inactive"}
</p>

</CardContent>

</Card>


{/* Danger Alert */}

<Card>

<CardHeader>
<CardTitle className="flex items-center gap-2">
<ShieldAlert className="text-red-500"/>
Danger Zone Warning
</CardTitle>
</CardHeader>

<CardContent className="space-y-4">

{/* Warning Message */}

<div className="p-4 bg-red-50 text-red-700 rounded-lg font-medium">
⚠ High crime risk detected in this area.
</div>

{/* Risk Level */}

<div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
<span>Risk Level</span>
<span className="text-red-600 font-semibold">High</span>
</div>

{/* Recent Crimes */}

<div className="p-3 bg-secondary rounded-lg">
<p className="font-medium mb-2">Recent Incidents</p>

<ul className="text-sm text-muted-foreground space-y-1">
<li>• Theft reported 1 hour ago</li>
<li>• Assault reported yesterday</li>
<li>• Robbery reported this week</li>
</ul>

</div>

{/* Nearby Police Station */}

<div className="flex justify-between items-center p-3 bg-secondary rounded-lg">

<div>
<p className="font-medium">Nearest Police Station</p>
<p className="text-sm text-muted-foreground">Chennai Central Police</p>
</div>

<button className="text-blue-600 text-sm font-semibold">
Call
</button>

</div>

{/* Safe Route Suggestion */}

<div className="p-3 bg-green-50 text-green-700 rounded-lg">

🟢 Suggested Safer Route Available

</div>

</CardContent>


</Card>


</div>


{/* Map Placeholder */}

<Card>

<CardHeader>
<CardTitle>Safety Map</CardTitle>
</CardHeader>

<CardContent>
    

<div className="h-[400px] rounded-xl overflow-hidden">
  <SafetyMap />
</div>

</CardContent>

</Card>

</div>

)

}
