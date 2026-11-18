/* =========================
   CATEGORIES PAGE
========================= */

function goFood()
{
    window.location.href =
    "food.html";
}

function goGrocery()
{
    window.location.href =
    "grocery.html";
}

function goMedicine()
{
    window.location.href =
    "medicine.html";
}

function goPersonal()
{
    window.location.href =
    "personal_need.html";
}

function searchCategory()
{
    let keyword =
    document.getElementById("search")
    .value.toLowerCase();

    let cards =
    document.getElementsByClassName("card");

    for(let i=0; i<cards.length; i++)
    {
        let text =
        cards[i].innerText.toLowerCase();

        if(text.includes(keyword))
        {
            cards[i].style.display =
            "block";
        }
        else
        {
            cards[i].style.display =
            "none";
        }
    }
}





/* =========================
   FOOD PAGE
========================= */

function searchFood()
{
    let keyword =
    document.getElementById("foodSearch")
    .value.toLowerCase();

    let cards =
    document.getElementsByClassName("food-card");

    for(let i=0; i<cards.length; i++)
    {
        let text =
        cards[i].innerText.toLowerCase();

        if(text.includes(keyword))
        {
            cards[i].style.display =
            "block";
        }
        else
        {
            cards[i].style.display =
            "none";
        }
    }
}


function filterRestaurant()
{
    let selected =
    document.getElementById(
        "restaurantFilter"
    ).value;

    let cards =
    document.getElementsByClassName(
        "food-card"
    );

    for(let i=0; i<cards.length; i++)
    {
        let restaurant =
        cards[i].getAttribute(
            "data-restaurant"
        );

        if(selected=="all")
        {
            cards[i].style.display =
            "block";
        }
        else if(restaurant==selected)
        {
            cards[i].style.display =
            "block";
        }
        else
        {
            cards[i].style.display =
            "none";
        }
    }
}





/* =========================
GROCERY PAGE
========================= */
 
function searchGrocery()
{
let keyword =
document.getElementById(
"grocerySearch"
).value.toLowerCase();
 
let cards =
document.getElementsByClassName(
"grocery-card"
);
 
for(let i=0; i<cards.length; i++)
{
let text =
cards[i].innerText.toLowerCase();
 
if(text.includes(keyword))
{
cards[i].style.display =
"block";
}
else
{
cards[i].style.display =
"none";
}
}
}







/* =========================
   MEDICINE PAGE
========================= */

function searchMedicine()
{
    let keyword =
    document.getElementById(
        "medicineSearch"
    ).value.toLowerCase();

    let cards =
    document.getElementsByClassName(
        "medicine-card"
    );

    for(let i=0; i<cards.length; i++)
    {
        let text =
        cards[i].innerText.toLowerCase();

        if(text.includes(keyword))
        {
            cards[i].style.display =
            "block";
        }
        else
        {
            cards[i].style.display =
            "none";
        }
    }
}





/* =========================
   PERSONAL NEEDS PAGE
========================= */

function searchPersonal()
{
    let keyword =
    document.getElementById(
        "personalSearch"
    ).value.toLowerCase();

    let cards =
    document.getElementsByClassName(
        "personal-card"
    );

    for(let i=0; i<cards.length; i++)
    {
        let text =
        cards[i].innerText.toLowerCase();

        if(text.includes(keyword))
        {
            cards[i].style.display =
            "block";
        }
        else
        {
            cards[i].style.display =
            "none";
        }
    }
}


function submitRequest()
{
    let request =
    document.getElementById(
        "customerRequest"
    ).value;

    if(request.trim() == "")
    {
        alert(
            "Please enter a product request."
        );
        return;
    }

    if(request.length < 3)
    {
        alert(
            "Enter at least 3 characters."
        );
        return;
    }

    alert(
        "Request Submitted Successfully!"
    );

    document.getElementById(
        "customerRequest"
    ).value = "";
}