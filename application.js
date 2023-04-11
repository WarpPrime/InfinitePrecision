class update {
    update() {
        try {
            var num = new BigDecimal(document.getElementById("input").value);
            document.getElementById("int").innerHTML = num.int;
            document.getElementById("float").innerHTML = num.float;
        }
        catch {return;}
    }
}

var updater = new update();