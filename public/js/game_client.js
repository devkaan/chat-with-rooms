
const allInputs = document.querySelectorAll('.input');
allInputs.forEach(element => {
    element.addEventListener('keyup', (e) => {
        const alert = document.getElementById('alert');
        alert.innerHTML = "";
        const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        if (e.key == "Tab" || e.key == "Shift") {
            return
        }
        if (!keys.includes(parseInt(e.key))) {
            alert.innerHTML = "Lutfen gecerli bir rakam yaz1";
        }
        console.log(e.key);
        let next = e.currentTarget.nextElementSibling;
        // console.log(next.nodeName, next);
        let val = parseInt(e.currentTarget.value);
        if (next.nodeName == "INPUT" && (val && !isNaN(val))) {
            next.focus();
        } else if (!val || isNaN(val)) {
            alert.innerHTML = "Lutfen gecerli bir rakam yaz2";
        }
    })
});

$('.guess').on('click', () => {
    const a = $('#alert'), info = $('#info'), f = document.getElementsByClassName('input'), btn = document.getElementsByClassName('guess')[0];
    a.html('');
    var values = [];
    for (let i = 0; i < f.length; i++) {
        let val = f[i].value;
        if (!val || isNaN(parseInt(val))) {
            f[i].focus();
            a.html('Lutfen gecerli bir rakam yaz3');
            return;
        } else if (val.length > 1) {
            f[i].value = val.substr(0, 1);
        } else {
            values.push(parseInt(val));
        }
    }
    let data = {
        values: values
    }
    socket.emit('guess', data);
    info.html('Tahmin yapildi. Simdi bilgisayarin sirasi');
    $('.guess').attr('disabled', 'disabled');
})