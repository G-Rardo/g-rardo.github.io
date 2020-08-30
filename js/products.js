const OrdenamientoAsc = "$";
const OrdenamientoDes= "$$";
const OrdenamientoRel = "Relevancia";
var ArrayProductos = [];
var currentSort = undefined;
var minCount = undefined;
var maxCount = undefined;

function sortProduct(criterio, array){
    let result = [];
    if (criterio === OrdenamientoAsc)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criterio === OrdenamientoDes){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criterio === OrdenamientoRel){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }
    return result;
}

function showProductList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < ArrayProductos.length; i++){
        let product = ArrayProductos[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount))){

            htmlContentToAppend += `
            <a href="product-info.html" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">`+ product.name + ' - ' + product.currency + ' ' + product.cost + `</h4>
                            <small class="text-muted">` + product.soldCount + ` vendidos </small>
                        </div>
                        <p class="mb-1">` + product.description + `</p>
                    </div>
                </div>
            </a>
            `; 
        }
    }
    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}

function sortAndShowProduct(sortCriterio, productArray){
    currentSort = sortCriterio;
    if(productArray != undefined){
        ArrayProductos = productArray;
    }
    ArrayProductos = sortProduct(currentSort, ArrayProductos);
    //Muestro los productos ordenados
    showProductList();
}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e) {
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            sortAndShowProduct(OrdenamientoAsc, resultObj.data);
        }
    });

    document.getElementById("sortCostAsc").addEventListener("click", function(){
        sortAndShowProduct(OrdenamientoAsc);
    });

    document.getElementById("sortCostDesc").addEventListener("click", function(){
        sortAndShowProduct(OrdenamientoDes);
    });

    document.getElementById("sortCostByCount").addEventListener("click", function(){
        sortAndShowProduct(OrdenamientoRel);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }
        showProductList();
    });
});