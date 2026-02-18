export interface WaterFact {
  fact: string
  naggerTake: string  // the snarky follow up comment
}

export const waterFacts: WaterFact[] = [
  {
    fact: "Your body is about 60% water.",
    naggerTake: "And yet here you are, actively trying to reduce that number. Impressive.",
  },
  {
    fact: "The '8 glasses a day' rule has no solid scientific backing. It came from a misread 1945 report.",
    naggerTake: "But 8 is still better than the 0 you've been managing. So we're keeping it.",
  },
  {
    fact: "Mild dehydration of just 1-2% body water loss can impair your mood, memory and concentration.",
    naggerTake: "So that brain fog you're blaming on Monday? That's on you. Drink water.",
  },
  {
    fact: "Your brain is approximately 75% water.",
    naggerTake: "No wonder you keep forgetting to hydrate. Your brain is literally drying out.",
  },
  {
    fact: "Drinking water can boost your metabolism by up to 30% within 10 minutes.",
    naggerTake: "Free energy. Zero effort. And you still can't be bothered. Remarkable.",
  },
  {
    fact: "You lose about 2.5 liters of water daily through breathing, sweating and other functions.",
    naggerTake: "Your body is literally leaking and you haven't refilled once today. Think about that.",
  },
  {
    fact: "Thirst is actually a late indicator of dehydration. By the time you feel thirsty, you're already dehydrated.",
    naggerTake: "So waiting until you're thirsty is the hydration equivalent of waiting until your car is on fire to add oil.",
  },
  {
    fact: "Water makes up about 92% of your blood.",
    naggerTake: "Your blood needs water to be blood. This shouldn't need further explanation.",
  },
  {
    fact: "Dehydration is one of the most common causes of daytime fatigue.",
    naggerTake: "That afternoon slump? Not your job. Not your sleep. It's the water you're not drinking.",
  },
  {
    fact: "Drinking enough water can reduce the risk of kidney stones by up to 50%.",
    naggerTake: "Kidney stones are apparently one of the most painful things a human can experience. Just drink the water.",
  },
  {
    fact: "Your kidneys filter about 200 liters of blood daily and need water to do it properly.",
    naggerTake: "200 liters. Daily. And you can't manage 8 glasses. Your kidneys deserve better.",
  },
  {
    fact: "Water is the only nutrient that can improve athletic performance by 20-30% when properly consumed.",
    naggerTake: "Not a protein shake. Not a pre-workout. Just water. Wild concept.",
  },
  {
    fact: "A human can survive about 3 weeks without food but only 3 days without water.",
    naggerTake: "You skipped breakfast and thought that was rough. Perspective.",
  },
  {
    fact: "Drinking water before meals can reduce calorie intake and aid weight management.",
    naggerTake: "A free appetite suppressant and you're ignoring it. Truly baffling.",
  },
  {
    fact: "Cold water can help reduce core body temperature during exercise and heat exposure.",
    naggerTake: "You're out here sweating and suffering when the solution is just... a cold glass of water.",
  },
  {
    fact: "The human body cannot store water the way it stores fat or carbohydrates.",
    naggerTake: "There is no water reserve. No backup tank. You have to keep refilling. Like a fish.",
  },
  {
    fact: "Water lubricates your joints. Dehydration is a common trigger for joint pain.",
    naggerTake: "Your knees hurt? Your back aches? Have you tried not being dehydrated for once?",
  },
  {
    fact: "Your skin is about 64% water. Dehydration is one of the fastest ways to look tired and dull.",
    naggerTake: "No skincare routine in the world fixes dehydration. Drink water. It's cheaper than serum.",
  },
  {
    fact: "Even mild dehydration can cause headaches in many people.",
    naggerTake: "Before you reach for painkillers, try drinking a glass of water first. You might be surprised.",
  },
  {
    fact: "Water helps regulate your body temperature through sweating and respiration.",
    naggerTake: "Your body is a very sophisticated cooling system that requires water to function. You're not giving it water. Connect the dots.",
  },
]

export const getRandomFact = (): WaterFact => {
  return waterFacts[Math.floor(Math.random() * waterFacts.length)]
}

export const getDailyFact = (): WaterFact => {
  // same fact all day, changes at midnight
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  return waterFacts[dayOfYear % waterFacts.length]
}