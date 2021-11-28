
isclickedStart = true;
const s = $("#start");
const minute = document.querySelector('.minute');
const second = document.querySelector('.second');
// console.log(minute, second);
var secondCount = 1;
var minuteCount = 0;
var timeInterval;

s.on("click", () => {
    if (isclickedStart) {
        console.log('if');
        // timeInterval = setInterval(() => {
        //     isclickedStart = false;
        //     if (!isclickedStart) return
        //     if (secondCount == 59) {
        //         minuteCount++;
        //         minuteCount = (parseInt(minuteCount) < 10) ? ('0' + minuteCount) : minuteCount;
        //         minute.innerHTML = `${minuteCount}`;
        //         secondCount = 0;
        //     }
        //     secondCount = (parseInt(secondCount) < 10) ? ('0' + secondCount) : secondCount;

        //     second.innerHTML = `${secondCount}`;
        //     secondCount++;
        // }, 1000);
        url = "/matchmaking/";
        let data = $('form').serialize();
        s.attr('disabled', 'disabled');
        // console.log(`matchmaking.js data =>`, data);
        $.post(url, data, (res) => {
            if (res.data.success) {
                message = "Mac bulundu. Hemen yonlendirileceksiniz..";
                popup(message, "", "success");
                let url = `/play/`;
                setTimeout(() => {
                    window.location.href = url;
                }, 2000);
            } else if (res.data.status == 2) {
                message = "Devam eden bir maciniz var. Hemen yonlendiriliyorsunuz..";
                popup(message, "", "info");
                let url = `/play/`;
                setTimeout(() => {
                    window.location.href = url;
                }, 2000);
            }
            else if (res.data.error == 1) {
                message = res.message; s.attr('disabled', 'none');
                popup(message, "auto", "warning", 4000);
            }
            isclickedStart = true;
        });
    }
    else {
        console.log(`else`);
        clearInterval(timeInterval);
    }
});

$('.gameModeButton').on('click', (e) => {
    $('.gameModeButton.selected').removeClass('selected');
    const el = e.currentTarget
    const bool = el.classList.contains('selected');
    if (bool) {
        el.classList.remove('selected');
    } else {
        el.classList.add('selected');
    }

})
$('.personModeButton').on('click', (e) => {
    $('.personModeButton.selected').removeClass('selected');
    const el = e.currentTarget
    const bool = el.classList.contains('selected');
    if (bool) {
        el.classList.remove('selected');
    } else {
        el.classList.add('selected');
    }
})
