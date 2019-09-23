const fontSize = {};
fontSize.defaultValues = [
    {
        text: '60%',
        value: '60%',
        vw: '0.6vw',
        px: '12px',
    },
    {
        text: '70%',
        value: '70%',
        vw: '0.8vw',
        px: '15px',
    },
    {
        text: '80%',
        value: '80%',
        vw: '1vw',
        px: '19px',
    },
    {
        text: '100%',
        value: '100%',
        vw: '1.4vw',
        px: '27px',
    },
    {
        text: '110%',
        value: '110%',
        vw: '1.6vw',
        px: '31px',
    },
    {
        text: '120%',
        value: '120%',
        vw: '1.8vw',
        px: '35px',
    },
    {
        text: '130%',
        value: '130%',
        vw: '2vw',
        px: '38px',
    },
    {
        text: '140%',
        value: '140%',
        vw: '2.2vw',
        px: '42px',
    },
    {
        text: '150%',
        value: '150%',
        vw: '2.4vw',
        px: '46px',
    },
    {
        text: '160%',
        value: '160%',
        vw: '2.6vw',
        px: '50px',
    },
    {
        text: '180%',
        value: '180%',
        vw: '3vw',
        px: '58px',
    },
    {
        text: '200%',
        value: '200%',
        vw: '3.4vw',
        px: '65px',
    },
    {
        text: '220%',
        value: '220%',
        vw: '3.8vw',
        px: '73px',
    },
    {
        text: '230%',
        value: '230%',
        vw: '4vw',
        px: '77px',
    },
];
fontSize.fontSizeChange = (isVw, text, mobile) => {
    let r;
    fontSize.defaultValues.forEach(val => {
        if (val.text === text) {
            if (isVw) {
                r = val.vw;
            }
            else {
                r = val.text;
            }
            if (mobile === "mobile") {
                r = val.px;
            }
        }
    });
    return r;
};
fontSize.fontSizeCompatibility = (isVw, value) => {
    let r;
    fontSize.defaultValues.forEach(val => {
        if (isVw) {
            if (val.vw === value) {
                r = val.value;
            }
        }
        else {
            if (val.px === value) {
                r = val.value;
            }
        }
    });
    return r;
};
export default fontSize;