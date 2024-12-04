let gameRooms = [
    {
        // Player quits
        room: 0,
        text: () => {
            gameVars.gameOver = true
            return `Goodbye, ${gameVars.player}...`
        },
    },
    {
        // Welcome player
        room: 1,
        text: () => {
            return `Welcome ${gameVars.player}, do you want to play a game?
            Yes / No.`
        },
        options: [
            {
                choice: "yes",
                nextRoom: 2,
            },
            {
                choice: "no",
                nextRoom: 0,
            }
        ]
    },
    {
        // How to play
        room: 2,
        text: `Good. To play, type the letter of your choice and click enter.
        Or, you can enter "quit" to end the game.
        Or, you can click "reset" above to reset the game.

        Ready to start?
        [A] Okay.
        [B] Actually, I don't think I want to play after all.`,
        options: [
            {
                choice: "a",
                nextRoom: 3,
            },
            {
                choice: "b",
                nextRoom: 0,
            }
        ]
    },
    {
        // Game start for real
        room: 3,
        text: `You slowly open your eyes to find yourself safely in your own bed. At first the room seems pitch black, except for the light from the clock on your bedside table.It reads: 02:00.
            Slowly, your eyes adjust to the darkness and you look around your quiet room. You don't know why, but you feel wide awake and your heart is beating hard.

            You:
            [A] Try to go back to sleep.
            [B] Get up and make a cup of tea.`,
        options: [
            {
                choice: "a",
                nextRoom: 4,
            },
            {
                choice: "b",
                nextRoom: 7,
            }
        ]
    },
    {
        // Try to sleep
        room: 4,
        text: `You have to get up for school early in the morning. So, you roll over in your bed and pull the covers up over your head.
        After a few moments of silence, you hear a soft rustling. Very slowly, you peek out from under your covers.
        In the darkness, you spy the window open a crack. A light breeze is moving the curtains.
        
        It's chilly in your room, so you:
        [A] Pull the blanket tighter and close your eyes.
        [B] Get up.`,
        options: [
            {
                choice: "a",
                nextRoom: 5,
            },
            {
                choice: "b",
                nextRoom: 8,
            }
        ]
    },
    {
        // Keep trying to sleep
        room: 5,
        text: () => {
            return `You pull the blanket back over your head and squeeze your eyes shut.\n
            "${gameVars.player}..." \n
            You think you hear a voice softly calling you. You're not sure where it's coming from, or even if you really heard it.
            \n
            You decide to:
            [A] Sleep harder.
            [B] Investigate.`
        },
        options: [
            {
                choice: "a",
                nextRoom: 6,
            },
            {
                choice: "b",
                nextRoom: 8,
            },
        ]
    },
    {
        // First game end
        room: 6,
        text: () => {
            return `You really do have to get up early and you've never been a very inquisitive person.
        You pull the blanket tight around your ears and scrunch your eyes closed even harder. 
        As you do, you feel a chill run up the back of your neck and the blanket starts to feel very heavy...\n
        "${gameVars.player}..."\n
        Who's saying that?
        You try to open your eyes and peek out from the covers, but your eyelids won't open and the covers are weighing you down...\n
        The covers press harder and harder and your eyelids squeeze tighter and tighter until all you feel is pressure and all you see is nothingness.\n
        You never wake up again.
        \n
        \n
        The End.`
        },
    },
    {
        // Get up, choose btw window and slippers
        room: 7,
        text: `Maybe a cup of tea will warm you up and help you drift off to  sleep.
        You climb out of bed. You glance at the open window that's letting a cold breeze into the house. At the end of your bed are an oversized pair of fluffy bunny slippers.
        
        You shiver and:
        [A] Close the window.
        [B] Put on your fluffy slippers.`,
        options: [
            {
                choice: "a",
                updateVar: () => {
                    gameVars.windowClosed = true
                },
                nextRoom: 8,
            },
            {
                choice: "b",
                pickUp: "slippers",
                nextRoom: 8,
            },
        ]
    },
    {
        // Choose btw checking closet or not
        room: 8,
        text: () => {
            if (gameVars.windowClosed) {
                return `You slide the window closed and shuffle out into the hallway in your bare feet.
                The house is still. You cannot hear a sound. You creep along the hallway as quietly as you can.
                As you go, on your left you pass the hallway closet.
                
                You feel compelled to:
                [A] Check inside, though it's as quiet as the rest of the house.
                [B] Keep going - you don't need to encourage your imagination.`
            } else {
                return `You shiver and slip your slippers on, then shuffle out into the hallway.
                The house is still. You cannot hear a sound. You creep along the hallway as quietly as you can.
                As you go, on your left you pass the hallway closet.
                
                You feel compelled to:
                [A] Check inside, though it's as quiet as the rest of the house.
                [B] Keep going - you don't need to encourage your imagination.`
            }
        },
        options: [
            {
                choice: "a",
                nextRoom: 9,
            },
            {
                choice: "b",
                nextRoom: 10,
            }
        ],
    },
    {
        // Check closet, choose item
        room: 9,
        text: `For some reason, you decide to investigate the quiet closet.
        You try to peek through the slats of the closet door, but see nothing except darkness. Slowly, you open the closet and peer inside.\n
        As expected, there is only the regular assortment of clutter - coats, shoes, golf clubs, your old teddy bear 'Burt'.
        
        You decide to:
        [A] Take Burt with you, you haven't spent much time together lately.
        [B] Take a golf club.
        [C] Take nothing with you, you don't know why you decided to look in the closet in the first place.`,
        options: [
            {
                choice: "a",
                pickUp: "teddy",
                nextRoom: 10,
            },
            {
                choice: "b",
                pickUp: "club",
                nextRoom: 10,
            },
            {
                choice: "c",
                nextRoom: 10,
            }
        ]
    },
    {
        // Choose to check master bedroom or not
        room: 10,
        text: () => {
            if (pickUps.includes("teddy")) {
                return `You take Burt down from the shelf in the closet and grip him tightly in your arms.
                You continue down the hallway and pass the master bedroom on your right.\n
                "${gameVars.player}..."

                Who said that?
                You think it came from inside the door. It was so quiet though. Maybe it was just your mind playing tricks on you?

                You:
                [A] Investigate.
                [B] Ignore it. It was just the wind.`
            } else if (pickUps.includes("club")) {
                return `You nod at Burt, but pull a long golf club from the bag in the back of the closet. The metal feels cold in your hands.
                You continue down the hallway and pass the master bedroom on your right.\n
                "${gameVars.player}..."

                Who said that?
                You think it came from inside the door. It was so quiet though. Maybe it was just your mind playing tricks on you?

                You:
                [A] Investigate.
                [B] Ignore it. It was just the wind.`
            } else {
                return `You continue down the hallway and pass the master bedroom on your right.\n
                "${gameVars.player}..."

                Who said that?
                You think it came from inside the door. It was so quiet though. Maybe it was just your mind playing tricks on you?

                You:
                [A] Investigate.
                [B] Ignore it. It was just the wind.`
            }
        },
        options: [
            {
                choice: "a",
                updateVar: () => {
                    gameVars.doorOpen = true
                },
                nextRoom: 11,
            },
            {
                choice: "b",
                nextRoom: 12,
            }
        ]
    },
    {
        // Check master bedroom
        room: 11,
        text: `Very slowly, you creep across the hall to the door. You press your ear up against it, but can hear nothing from inside.
        The door knob feels cool on your hand. Gingerly, you turn it. The door creaks as you push it open a crack.
        Peering inside, the room is so dark you can only see the outline of the duvet on the bed.
        Nothing is stirring in the room. You cannot hear a sound.
        Relieved, you leave the door open a crack and continue towards the kitchen...
        
        `,
        options: [
            {
                choice: "a",
                nextRoom: 12,
            },
        ]
    },
    {
        // Go to kitchen
        room: 12,
        text: () => {
            if (pickUps.includes("teddy")) {
                if (pickUps.includes("slippers")) {
                    return `You continue on towards the kitchen. It is as quiet as the rest of the house. Moonlight filters in through the windows and illuminates the room.
                    The kettle is tucked right in under the cabinets on the counter.

                    You think:
                    [A] There's a stool here somewhere.
                    [B] You can reach it if you stretch.`                    
                } else {
                    return `You continue on towards the kitchen. It is as quiet as the rest of the house. Moonlight filters in through the windows and illuminates the room.
                    The tiles feel like ice under your bare feet. You hug Burt closely.
                    The kettle is tucked right in under the cabinets on the counter.

                    You think:
                    [A] There's a stool here somewhere.
                    [B] You can reach it if you stretch.`                    
                }
            } else {
                return `You continue on towards the kitchen. It is as quiet as the rest of the house. Moonlight filters in through the windows and illuminates the room.
                The tiles feel like ice under your bare feet. You shiver and hug yourself.
                The kettle is tucked right in under the cabinets on the counter.

                You think:
                [A] There's a stool here somewhere.
                [B] You can reach it if you stretch.`
            }
        },
        options: [
            {
                choice: "a",
                updateVar: () => {
                    gameVars.stoolOut = true
                },
                nextRoom: 13,
            },
            {
                choice: "b",
                nextRoom: 14,
            }
        ]
    },
    {
        // Get stool
        room: 13,
        text: `You think you remember the stool by the backdoor. You walk past the island in the middle of the kitchen, past the table and find the stool next to the door, beside your wellies.
        You glance at the door quickly as you retrieve the stool. It looks locked to you. Of course it is.
        You bring the stool back over to the counter and step up on it.
        You can easily pull the kettle out from under the cabinet...
        
        `,
        options: [
            {
                choice: "a",
                nextRoom: 15,
            },
        ]
    },
    {
        room: 14,
        text: () => {
            if (pickUps.includes("teddy")) {
                let index = pickUps.indexOf("teddy")
                pickUps.splice(index, 1)
                return `You think your arms are long enough. The counter is a little wide, though. So, you pop Burt on the counter to free your hands.
                On your toes, leaning on the counter with one hand, you reach out for the kettle. You can just about pull it out from under the cabinet.
                
                `
            } else if (pickUps.includes("club")) {
                let index = pickUps.indexOf("club")
                pickUps.splice(index, 1)
                return `You think your arms are long enough. The counter is a little wide, though. So, you place the golf club down to free your hands.
                On your toes, leaning on the counter with one hand, you reach out for the kettle. You can just about pull it out from under the cabinet.
                
                `
            } else {
                return `You think your arms are long enough. The counter is a little wide, though.
                On your toes, leaning on the counter with one hand, you reach out for the kettle. You can just about pull it out from under the cabinet.
                
                `
            }
        },
        options: [
            {
                choice: "a",
                nextRoom: 15,
            },
        ]
    },
    {
        room: 15,
        text: () => {
            if (gameVars.stoolOut) {
                return `You flick the switch on the kettle and the little light above it comes on. It starts a low rumble. While the kettle boils, you collect your ingredients.
                Your favourite mug is sitting on the edge of the sink where you left it that afternoon. You collect it.
                The tea bags and sugar are much easier to reach than the kettle. You place a tea bag in your mug. You take a spoon from the drawer and place it next to your cup.\n
                You walk over to the fridge to get the milk. You open the door and take out the milk carton. As the fridge door closes, you can see the back door. It is slightly open.\n
                But, it was just closed?
                
                `
            } else {
                return `You flick the switch on the kettle and the little light above it comes on. It starts a low rumble. While the kettle boils, you collect your ingredients.
                Your favourite mug is sitting on the edge of the sink where you left it that afternoon. You collect it.
                The tea bags and sugar are much easier to reach than the kettle. You place a tea bag in your mug. You take a spoon from the drawer and place it next to your cup.\n
                You walk over to the fridge to get the milk. You open the door and take out the milk carton. As the fridge door closes, you can see the back door. It is slightly open.\n
                Was that open before?
                
                `
            }
        },
        options: [
            {
                choice: "a",
                nextRoom: 16,
            },
        ]
    },
    {
        room: 16,
        text: `As you watch, the back door slowly creaks open. A shadowy figure forms before you. The hair stands up on the back of your neck as it approaches.\n
        It seems to glide across the floor without taking a step.
        
        You: 
        [A] Freeze.
        [B] Run.`,
        options: [
            {
                choice: "a",
                nextRoom: 17,
            },
            {
                choice: "b",
                nextRoom: 20,
            },
        ]
    },
    {
        room: 17,
        text: () => {
            return `"${gameVars.player}," the shadowy figure whispers.
            
            You:
            [A] Call for help.
            [B] Run.`
        },
        options: [
            {
                choice: "a",
                nextRoom: 18,
            },
            {
                choice: "b",
                nextRoom: 20,
            },
        ]
    },
    {
        room: 18,
        text: () => {
            if (pickUps.includes("teddy")) {
                let thisRoom = gameRooms.findIndex(current => current.room === 18)
                gameRooms[thisRoom].options[0].nextRoom = 20
                let index = pickUps.indexOf("teddy")
                pickUps.splice(index, 1)
                return `You open your mouth, but then in a panic you toss Burt at the figure. The shadow stops and catches him. 
                While it's distracted, you make a break for it.
                
                `
            } else if (pickUps.includes("club")) {
                return `The figure reaches for you. Impulsively, you swing the golf club that is still in your hands. 
                You miss and the shadow continues to advance...
                
                `
            } else {
                return `The shadow approaches.
                
                `
            }
        },
        options: [
            {
                choice: "a",
                nextRoom: 19,
            },
        ]
    },
    {
        // Reusable game end - user dies
        room: 19,
        text: () => {
            return `You open your mouth to cry out for help, but your voice stops in your throat.\n
            "${gameVars.player}," the figure groans.\n
            It reaches for you.
            Your legs quiver. Your feet refuse to listen to you. Your eyes widen but your vision fades. You can feel a weight press down upon you...
            
            You are overcome with darkness. All you feel and see and hear is nothingness.\n
            "Goodnight, ${gameVars.player}."\n
            You never wake up again.
            \n
            \n
            The End.`
        },
    },
    {
        // Run away
        room: 20,
        text: () => {
            if (gameVars.stoolOut) {
                if (pickUps.includes("slippers")) {
                    if (pickUps.includes("teddy")) {
                        let index = pickUps.indexOf("teddy")
                        pickUps.splice(index, 1)
                        return `You turn and run.\n
                        "${gameVars.player}," the figure growls.\n
                        You run through the kitchen and hop over the stool as you go. As you leap, the bunny ears of your fluffy slippers catch on the stool and you fall! 
                        You collapse on the kitchen tiles and the shadow looms over you.\n
                        In a panic, you throw Burt at the shadowy figure. It catches him. As it seems to stare at Burt in confusion , you kick your slippers off and run for the hallway.
                        
                        `
                    } else {
                        let thisRoom = gameRooms.findIndex(current => current.room === 20)
                        gameRooms[thisRoom].options[0].nextRoom = 19
                        return `You turn and run.\n
                        "${gameVars.player}," the figure growls.\n
                        You run through the kitchen and hop over the stool as you go. As you leap, the bunny ears of your fluffy slippers catch on the stool and you fall! 
                        You collapse on the kitchen tiles and the shadow looms over you.
                        
                        `
                    }
                } else {
                    gameVars.shadowDelayed = true
                    return `You run through the kitchen, hopping over the stool as you go. The figure follows, but as you reach the hallway, you glance back and see it stumble over your step stool and fall on the kitchen tiles.
                    
                    `
                }
            } else {
                return `You turn and run.\n
                "${gameVars.player}," the figure growls.
                
                `
            }
        },
        options: [
            {
                choice: "a",
                nextRoom: 21,
            },
        ]
    },
    {
        // Run to hallway
        room: 21,
        text: () => {
            if (gameVars.shadowDelayed) {
                return `You reach the hallway before the shadowy figure can gather itself.
                You have to hide.

                You run to:
                [A] The master bedroom.
                [B] The closet.
                [C] The front door.
                [D] Your bedroom.`
            } else {
                return `You reach the hallway, but the shadow is right on your heels.
                There's little time.
                You have to hide.

                You run to:
                [A] The master bedroom.
                [B] The closet.
                [C] The front door.
                [D] Your bedroom.`
            }
        },
        options: [
            {
                choice: "a",
                nextRoom: 22,
            },
            {
                choice: "b",
                nextRoom: 26,
            },
            {
                choice: "c",
                nextRoom: 27,
            },
            {
                choice: "d",
                nextRoom: 28,
            },
        ]
    },
    {
        // Run to master bedroom
        room: 22,
        text: () => {
            if (gameVars.shadowDelayed) {
                if (gameVars.doorOpen) {
                    let thisRoom = gameRooms.findIndex(current => current.room === 22)
                    gameRooms[thisRoom].options[0].nextRoom = 23
                    return `The master bedroom is closest so you race for the door.
                    You slip through the open door.\n
                    Expecting safety, you realise the mound of blankets you saw earlier is just that - blankets. The room is empty.
                    You have no time to wonder why, so you dive underneath the bed.
                    
                    `
                } else {
                    let thisRoom = gameRooms.findIndex(current => current.room === 22)
                    gameRooms[thisRoom].options[0].nextRoom = 24
                    return `The master bedroom is closest so you race for the door.
                    
                    `
                }
            } else {
                return `The master bedroom is closest so you race for the door.
                You almost reach the door, but the shadowy figure is right behind you.
                
                `
            }
        },
        options: [
            {
                choice: "a",
                nextRoom: 19,
            },
        ]
    },
    {
        // User hides - reusable?
        room: 23,
        text: `An eternity passes as you hide in the darkness. Is it still out there?\n
        You think you hear something pass by the door, but did you just imagine that?\n
        How much longer can you wait?\n
        You think you can hear a sound coming from the kitchen.
        
        You decide to:
        [A] Run to your bedroom.
        [B] Stay hidden.`,
        options: [
            {
                choice: "a",
                nextRoom: 28,
            },
            {
                choice: "b",
                nextRoom: 25,
            },
        ]
    },
    {
        // Master Bedroom locked
        room: 24,
        text: `You turn the doorknob, but the door won't open. It's locked? Why?
        
        You turn around and:
        [A] Run to the closet.
        [B] Run to your bedroom.`,
        options: [
            {
                choice: "a",
                nextRoom: 26,
            },
            {
                choice: "b",
                nextRoom: 28,
            },
        ]
    },
    {
        // Stay hidden, die
        room: 25,
        text: `You stay frozen in fear where you are.
        A cold chill runs up your spine and, suddenly, you see it before you.
        
        `,
        options: [
            {
                choice: "a",
                nextRoom: 19,
            },
        ]
    },
    {
        // Hide in closet
        room: 26,
        text: () => {
            if (gameVars.shadowDelayed) {
                let thisRoom = gameRooms.findIndex(current => current.room === 26)
                gameRooms[thisRoom].options[0].nextRoom = 23
                return `You race for the closet, diving through the slatted doors and pulling them closed behind you. Hastily, you cover yourself in a pile of winter coats. You put your hand to your mouth and try to stay as quiet as you can.\n
                All you can hear is your own breathing.
                
                `
            } else {
                let thisRoom = gameRooms.findIndex(current => current.room === 26)
                gameRooms[thisRoom].options[0].nextRoom = 25
                return `You race for the closet, diving through the slatted doors and pulling them closed behind you. Hastily, you cover yourself in a pile of winter coats. You put your hand to your mouth and try to stay as quiet as you can.\n
                All you can hear is your own breathing.
                Only seconds pass before the closet door slowly opens.
                
                `
            }
        },
        options: [
            {
                choice: "a",
                nextRoom: 23,
            },
        ]
    },
    {
        // Front door
        room: 27,
        text: () => {
            if (pickUps.includes("teddy")) {
                let index = pickUps.indexOf("teddy")
                pickUps.splice(index, 1)
                let thisRoom = gameRooms.findIndex(current => current.room === 27)
                gameRooms[thisRoom].options[0].nextRoom = 25
                return `You race for the front door, hoping to escape from the house.You pull on the handle. The door won't budge.\n
                "${gameVars.player}," whispers the shadowy figure as it approaches.\n
                You fumble with the door and, too late, realise the bolt at the top is locked, out of reach.
                In a panic, you throw Burt at the shadowy figure. It catches him.
                As it seems to stare at Burt in confusion, you run for your bedroom.
                
                `
            } else {
                return `You race for the front door, hoping to escape from the house.You pull on the handle. The door won't budge.\n
                "${gameVars.player}," whispers the shadowy figure as it approaches.\n
                You fumble with the door and, too late, realise the bolt at the top is locked, out of reach.
                
                `
            }
        },
        options: [
            {
                choice: "a",
                nextRoom: 19,
            },
        ]
    },
    {
        // Run to bedroom
        room: 28,
        text: `You race into your bedroom. As quickly and quietly as you can, you close the door behind you. What now?
        
        You:
        [A] Slide under your bed.
        [B] Run to the window.
        [C] Jump back into bed and pull the covers over your head`,
        options: [
            {
                choice: "a",
                nextRoom: 29,
            },
            {
                choice: "b",
                nextRoom: 30,
            },
            {
                choice: "c",
                nextRoom: 32,
            },
        ]
    },
    {
        // Under bed
        room: 29,
        text: () => {
            return `You dive head first under your bed and curl yourself into as small of a ball as you can.\n
            You cover your mouth and try to quiet your breathing.\n
            "${gameVars.player}."\n
            The bedroom door creaks open slowly.
            
            `
        },
        options: [
            {
                choice: "a",
                nextRoom: 25,
            },
        ]
    },
    {
        // Run to window
        room: 30,
        text: () => {
            if (gameVars.windowClosed) {
                if (pickUps.includes("club")) {
                    return `You run over to the window and try to slide it open, but it's jammed. You can't force it.
                    The golf club! You still have it!
                    You can hear the door slowly open behind you.\
                    "${gameVars.player}," the shadow softly growls.
                    You swing the club and smash the window!
                    
                    `
                } else {
                    let thisRoom = gameRooms.findIndex(current => current.room === 30)
                    gameRooms[thisRoom].options[0].nextRoom = 19
                    return `You run over to the window and try to slide it open.
                    It's jammed. Pushing with all your strength, you can't force it open.\n
                    You turn as the bedroom door slowly opens and try to make yourself as small as you can in the corner of the room...
                    
                    `
                }
            } else {
                return `You run over to the window. It's still open a crack. You slide it open even wider as you hear your bedroom door slowly open behind you.\n
                "${gameVars.player}," the shadow softly growls...
                
                `
            }
        },
        options: [
            {
                choice: "a",
                nextRoom: 31,
            },
        ]
    },
    {
        // Escape house - game end??
        room: 31,
        text: `You slip out your bedroom window and run out on to the footpath. Looking back at your house, you think you see the shadow in your window.\n
        It's quiet out. The road is still. There are no lights in any of the houses.\n
        Your grandparents live nearby. You go there every Sunday, it's not a very longdrive.\n
        You think you know which way to go. It'll be safe there.\n
        You start walking.
        \n
        \n
        The End.`,
    },
    {
        // Back to bed
        room: 32,
        text: () => {
            if (pickUps.includes("teddy")) {
                let thisRoom = gameRooms.findIndex(current => current.room === 32)
                gameRooms[thisRoom].options[0].nextRoom = 33
                return `You dive into your bed and pull the covers up over your head.
                You close your eyes and try as hard as you can to fall back to sleep.
                You hug Burt close.
                
                `
            } else {
                let thisRoom = gameRooms.findIndex(current => current.room === 32)
                gameRooms[thisRoom].options[0].nextRoom = 25
                return `You dive into your bed and pull the covers up over your head.
                You close your eyes and try as hard as you can to fall back to sleep.
                You can hear it. The bedroom creaks open. You lift the edge of your blankets and peek out with one eye.
                
                `
            }
        },
        options: [
            {
                choice: "a",
                nextRoom: 33,
            },
        ]
    },
    {
        room: 33,
        text: () => {
            return `"${gameVars.player}, why is there milk all over the kitchen floor?"\n
            Your eyes open. Light seeps in around your blankets. You throw them back.\n
            It's morning. Your bedroom is bright and empty. There are no shadowy figures lurking in the corners.\n
            It must have all been a terrible nightmare.\n
            You're safe.\n
            You look at Burt, still cradled in your arms.
            
            The End.`
        },
    }
]

const reset = document.getElementById("reset")
const start = document.getElementById("start")
const fastText = document.getElementById("fast-text")
const slowText = document.getElementById("slow-text")
const display = document.getElementById("message")
const input = document.getElementById("user-input")
const userBtn = document.getElementById("user-answer")

// Variables
let i = 0
let speed = 50
let roomIndex = 1

let gameVars = {
    player: "Stranger",
    started: false,
    windowClosed: false,
    doorOpen: false,
    stoolOut: false,
    shadowDelayed: false,
    gameOver: false,
}

let pickUps = []

/**
 * Functions affecting output
 */

function typewriter(text, roomIndex) {
    roomIndex = roomIndex
    console.log(roomIndex)
    let output = text
    if (i < output.length) {
        if (output.charAt(i) == "\n") {
            display.innerHTML += "<br>"
        } else {
            display.innerHTML += output.charAt(i)
        }
        i++
        setTimeout(typewriter, speed, output, roomIndex) 
        display.scrollTop = display.scrollHeight
    } else {
        if (roomIndex != undefined) {
            let gameRoom = gameRooms.find(gameRoom => gameRoom.room === roomIndex)
            if ("options" in gameRoom) {
                if (gameRoom.options.length == 1) {
                    let roomChoice = gameRoom.options[0].choice
                    return noChoice(roomChoice)
                }
            } else {
                if (!gameVars.gameOver) {
                    setTimeout(() => {
                        return showGameRoom(0)
                    }, 2000)                       
                }
            }          
        }
        takeInput()        
    }
}

function clearOutput() {
    display.innerHTML = ""
}

function clearInput() {
    input.value = ""
}

function takeInput() {
    userBtn.addEventListener("click", compareChoice, false)
}

function stopInput() {
    userBtn.removeEventListener("click", compareChoice, false)
}

// Game function
function getPlayer() {
    clearOutput()
    input.focus()
    typewriter("Hello, what's your name?")
    start.removeEventListener("click", getPlayer)
    userBtn.addEventListener("click", getName, false)
}

function getName() {
    let username = input.value.trim()
    if (username == undefined || username == null || username == "") {
        gameVars.player = "Stranger"
        userBtn.removeEventListener("click", getName)
        clearInput()
        return startGame()
    } else {
        gameVars.player = username[0].toUpperCase() + username.slice(1).toLowerCase();
        userBtn.removeEventListener("click", getName)
        clearInput()
        return startGame()
    }
}

function startGame() {
    showGameRoom(1)
    console.log(gameVars)
}

function showGameRoom(roomIndex) {
    stopInput()
    clearInput()
    i = 0
    clearOutput()
    input.focus()
	let gameRoom = gameRooms.find(gameRoom => gameRoom.room === roomIndex)
    console.log(gameRoom)
    console.log(pickUps)
    let roomText
    if (typeof gameRoom.text === "function") {
        roomText = gameRoom.text()
        typewriter(roomText, roomIndex)
    } else {
        roomText = gameRoom.text
        typewriter(roomText, roomIndex)
    }
} 

function compareChoice() {
    let userChoice = input.value.trim().toLowerCase()
	let gameRoom = gameRooms.find(gameRoom => gameRoom.room === roomIndex)
    let options = gameRoom.options
    console.log(options)
    console.log(gameRoom)
    if (userChoice == "quit") {
        return showGameRoom(0)
    } else {
        if (options.some(option => option.choice === userChoice)){
            for (const option of options) {
                if (option.choice === userChoice) {
                    if ("pickUp" in option) {
                        console.log(option.pickUp)
                        pickUps.push(option.pickUp)
                    } else if ("updateVar" in option) {
                        option.updateVar()
                    }
                    roomIndex = option.nextRoom
                    console.log("This is the nextRoom: " + roomIndex)
                    return showGameRoom(roomIndex)
                    }
                }
        } else {
            clearOutput()
            display.innerHTML += "That is not an option. Try again.<br>"
            setTimeout(() => {
                showGameRoom(gameRoom.room)
            }, 1500)
        }
    }
}

function noChoice(autoChoice) {
    let choice = autoChoice
	let gameRoom = gameRooms.find(gameRoom => gameRoom.room === roomIndex)
    let option = gameRoom.options[0]
    console.log(option)
    console.log(gameRoom)
    if (option.choice === choice) {
        if ("pickUp" in option) {
            console.log(option.pickUp)
            pickUps.push(option.pickUp)
        } else if ("updateVar" in option) {
            option.updateVar()
        }
        roomIndex = option.nextRoom
        console.log("This is the nextRoom: " + roomIndex)
        return showGameRoom(roomIndex)
    }
}


// Eventlisteners
fastText.addEventListener("click", () => {
    speed = 50
})
slowText.addEventListener("click", () => {
    speed = 100
})
start.addEventListener("click", getPlayer)
reset.addEventListener("click", () => {
    location.reload()
})
