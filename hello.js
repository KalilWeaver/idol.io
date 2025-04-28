
// Supabase client initialization
const supabaseUrl = 'https://zbvbngqrfadqjvehdqgn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidmJuZ3FyZmFkcWp2ZWhkcWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjYxMjgsImV4cCI6MjA2MDg0MjEyOH0.91JgaDgKRA9NVYzn15RdGUdsTvt4V7LRTTM8nHBj--E'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)


// team_list contains all information about a team
const team_list = new Map()
const leaderboard = new Array()

// Class for creating a new religion, tier can refer to which milestone the team has achieved and which buttons they have access to
class Team {
    constructor(name, point_total, image_file, tier) {
        this.name = name;
        this.point_total = point_total;
        this.image_file = image_file;
        this.tier = tier;
    }
    display_name() {
        return this.name;
    }
    display_points() {
        return this.point_total;
    }
    display_image() {
        return this.image_file;
    }
    display_tier() {
        return this.tier;
    }
    async increase_points() {
        this.point_total++;
        document.getElementById("points_display").innerHTML = this.point_total
        prayer_effects()

        // updates the database with the new points
        const {data, error} = await supabase
            .from('religion')
            .update({ point_total: this.point_total })
            .eq('name', this.name)
            .select()
            .single()

    }
}

// function to load teams in the database
async function load_teams() {
    const { data, error } = await supabase.from('religion').select('*');

    if (error) {
        console.error('Error loading teams:', error);
        return;
    }

    data.forEach(team => {
        const loaded_team = new Team(team.name, team.point_total, team.image_file, team.tier);
        team_list.set(team.name, loaded_team);

        leaderboard.push(
            `<button type="button" onclick="switch_team('${team.name}')">Join</button>&nbsp;&nbsp;&nbsp;&nbsp;` + team.name
        );
    });

    document.getElementById("leaderboard").innerHTML = leaderboard.join("<br>");
}

// Default Team that is selected when the page is loaded. This value will be overwritten by a team that the player chooses
var current_team = new Team("None", 0, "default-image.png", 1)

// Values to update when page is first loaded
window.onload = function() { 
    load_teams()
    document.getElementById("points_display").innerHTML = current_team.display_points()
    document.getElementById("team_name_display").innerHTML = current_team.display_name()
    document.getElementById("leaderboard").innerHTML = ""
    // sets up images for each religion
    idol_image_upload();
}

// Use this function to change elements whenever the window is resized
window.onchange = function() {
    // Update the prayer effects location (only works if there is no vertical scrollbar)
    let button = document.getElementById("pray_button")
    let rect = button.getBoundingClientRect()
    let x = ((rect.left + rect.right) / 2);
    let y = ((rect.top + rect.bottom) / 2);
    emoji.style.left = `${x}px`;
    emoji.style.top = `${y}px`;
}

// Function to create a prayer emoji effect after pressing prayer button
function prayer_effects() {
    // Creates a span element for the emoji
    let emoji = document.createElement("span")
    emoji.setAttribute("id", "emoji")
    emoji.textContent = "🙏"; 
    emoji.style.position = "absolute";
    emoji.style.fontSize = "24px";
    emoji.style.opacity = "1";
    emoji.style.transition = "transform 1s ease-out, opacity 1s ease-out";

    // Position of the emoji now follows the button
    let button = document.getElementById("pray_button")
    let rect = button.getBoundingClientRect()

    // Average of left right, top bottom (doesn't exactly center it)
    let x = rect.left
    let y = rect.top

    // Sets the position of the emoji
    emoji.style.left = `${x+35}px`;
    emoji.style.top = `${y-10}px`;

    // Adds the emoji to the body
    document.body.appendChild(emoji);

    // Animate emoji upwards
    setTimeout(() => {
        emoji.style.transform = "translateY(-50px)";
        emoji.style.opacity = "0";
    }, 10);

    // Remove emoji after animation
    setTimeout(() => {
        emoji.remove();
    }, 1000);

}

function idol_image_upload() {
    let idol_portrait = document.getElementById("idol_image");
    let input_file = document.getElementById("input-file");

    input_file.onchange = function () {
        idol_portrait.src = URL.createObjectURL(input_file.files[0]);
    };
}

function profanity_checker(text) {
    let banned_words = ["fuck", "shit", "ass", "bitch", "hoe", "slut", "tits", "dick", "pussy", "whores",
         "nigga", "faggot", "bastard", "cock", "cunt", "retard", "boob", "boobs", "titties", "boobies", "hell", "shitty", "whore" ];
    text = text.toLowerCase() // converts text to lowercase to detect profanity or slurs
    for (let word of banned_words) {
        if (text.includes(word)) {
            return true
        }
    }
    return false

}

// Gets the background music element
let background_music = document.getElementById("background_music");

// Runs every time a new team is created
document.addEventListener('DOMContentLoaded', init, false);
function init(){
    var background_music = document.getElementById("background_music")
    var team_form = document.getElementById("team_form")
    team_form.addEventListener("submit", function(event) {
        event.preventDefault()
        
        var input_name = document.getElementById("team_name").value
        // for religion/idol picture
        var idol_game_src = document.getElementById("idol_image").src

        // alert created if user does not put in team name
        if (input_name == "") {
            alert("Please enter a name for your religion!")
            return;
        }

        if (profanity_checker(input_name)) {
            alert("Innapropriate name! Please enter a different name.")
            return
        }

        if (team_list.has(input_name)) {
            alert("Religion already exists!")
            return;
        }

        // Adds the created team to the team list
        created_team = new Team(input_name, 0, idol_game_src, 1)
        team_list.set(input_name, created_team)

        // Creates a button for the new entry in the leaderboard that allows you to switch between teams

        leaderboard.push(`<button type=\"button\" onclick=\"switch_team('${input_name}')\">Join</button>&nbsp;&nbsp;&nbsp;&nbsp;` + input_name)
        
        // Updates the team name and points display
        document.getElementById("team_name_display").innerHTML = created_team.display_name()
        document.getElementById("points_display").innerHTML = created_team.display_points()

        // Updates and separates each value in the leaderboard with a line break
        document.getElementById("leaderboard").innerHTML = leaderboard.join("<br>") 

        // Updates the variable
        current_team = created_team

        document.getElementById("game").querySelector("#current_idol_image").src = idol_game_src;
        // this hides the team creating screen
        // document.getElementById("start_screen").style.display = "none";
        document.getElementById("game").style.visibility="visible";

        // Once the team is created it plays heavenly music
        background_music.play().catch(error => console.log("Autoplay blocked, user interaction needed."));

        // saves the team to the database
        supabase
         .from('religion')
         .insert([
             { name: input_name, point_total: 0, image_file: idol_game_src, tier: 1 }
         ])
         .then(({ data, error }) => {
             if (error) {
                 console.error('Error inserting team:', error);
             } else {
                 console.log('Team inserted successfully:', data);
             }
         });
    })
};

function switch_team(team) {
    current_team = team_list.get(team)
    document.getElementById("team_name_display").innerHTML = current_team.display_name()
    document.getElementById("points_display").innerHTML = current_team.display_points()
    document.getElementById("current_idol_image").src = current_team.display_image()
}

function clear_field() {
    document.getElementById("team_form").reset()
    document.getElementById("idol_image").src = "default-image.png"
}