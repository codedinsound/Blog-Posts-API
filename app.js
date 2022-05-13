// API Entry Point 
const app = require("express")(); 
const https = require("https"); 

// CONFIGURATIONS
// ======================================================
const PORT = 3000; 
const blogURL = "https://api.hatchways.io/assessment/blog/posts?tag=tech"


// MIDDLEWARE 
// ======================================================



// API GET ROUTES 
// ======================================================
app.get("/api/ping", (req, res, next) => {

}); 







// Retrieve data from API end point testing the data tag. 
https.get(blogURL,(res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let json = JSON.parse(body);
            
            console.log(json); 
        } catch (error) {
            console.error(error.message);
        };
    });

}).on("error", (error) => {
    console.error(error.message);
});




// app.get("/", (req, res, next) => {

//     res.send("<h1>Hi There</h1>"); 

// }); 





// ======================================================
// POST ROUTES 








// ======================================================
app.listen(PORT, () => console.log(`Listening on Port: ${PORT}`)); 





