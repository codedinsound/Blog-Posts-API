// Author: Luis Manuel Santander
// API Entry Point 
const app = require("express")(); 
const blogsCache = new (require("node-cache"));
const https = require("https"); 

// CONFIGURATIONS
// ======================================================
const PORT = process.env.PORT || 3000;  
const blogURL = "https://api.hatchways.io/assessment/blog/posts?tag="

// API GET ROUTES 
// ======================================================
app.get("/api/ping", (req, res, next) => {
        res.statusCode = 200; 
        res.send({success: true}); 
}); 

async function getBlogPosts(tag) {

    return await new Promise((resolve) => {
        let url = `${blogURL}${tag}`; 

        https.get(url,(res) => {
            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", () => {
                try {
                    let json = JSON.parse(body);
                    const { posts } = json; 
                    resolve(posts); 
                } catch (error) {
                    console.error(error.message);
                };
            });

        }).on("error", (error) => {
            console.error(error.message);
        });
    });
}

function compareWhatAndDirection(sortBy, direction, posts) {
    if (direction === "asc") {
        // Accending Order
        return posts.sort((a, b) => {
            if (a[sortBy] > b[sortBy]) {
                return -1; 
            }

            if (a[sortBy] < b[sortBy]) {
                return 1; 
            }

            return 0; 
        });
    } 

    return posts.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
            return -1; 
        }

        if (a[sortBy] > b[sortBy]) {
            return 1; 
        }

        return 0; 
    });
}

app.get("/api/posts", async (req, res, next) => {
    let blogPosts = [];  
    let { tags, sortBy, direction } = req.query; 

    if (tags == undefined) {
        res.statusCode = 400;
        res.json({error: "Tags parameter is required"}); 
        return; 
    }

    tags = tags.split(","); 

    if (direction != "desc") 
        direction = "asc"; 

    switch(sortBy) {
        case "reads":
            sortBy = "reads";
            break;
        case "likes":
            sortBy = "likes"; 
            break; 
        case "popularity":
            sortBy = "popularity"; 
            break; 
        case "id":
            sortBy = "id"; 
            break; 
        default: 
            res.statusCode = 400; 
            res.json({"error": "sortBy parameter is invalid"});
            return; 
    }     

    for (let i = 0; i < tags.length; i++) {
        posts = blogsCache.get(tags[i]); 

        if (!posts) {
            console.log("Does not exist fetching from hackways"); 
            posts = await getBlogPosts(tags[i]);
            blogsCache.set(tags[i], posts); 
        } else {
            console.log("Cache hit....."); 
        }
    
        blogPosts = blogPosts.concat(posts); 
    }

    blogPosts = compareWhatAndDirection(sortBy, direction, blogPosts); 

    res.send({posts: blogPosts});
}); 

// RUN THE SERVER
// ======================================================
app.listen(PORT, () => console.log(`Listening on Port: ${PORT}`)); 





