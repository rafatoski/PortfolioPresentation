window.onload = function(){
    //hide the preloader
    document.querySelector(".preloader").style.display = "none";
    //trigger wow animation
    new WOW().init();
    // dark light mode 
    const btnSwitch = document.querySelector('#switch');
    
    btnSwitch.addEventListener('click' , () => {
        document.body.classList.toggle('light');
        btnSwitch.classList.toggle('active');
    
        //localstorage
        if (document.body.classList.contains('light')){
            localStorage.setItem('light-mode' , 'true');
        }else {
            localStorage.setItem('light-mode' , 'false');       
        }
    });
    // modo actual
    if(localStorage.getItem('light-mode') === 'true'){
        document.body.classList.add('light');
        btnSwitch.classList.add('active');
    
    }else {
        document.body.classList.remove('light');
        btnSwitch.classList.remove('active');
    }
    
}