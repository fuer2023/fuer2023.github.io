(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Header fixed top on scroll
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    let headerOffset = selectHeader.offsetTop
    let nextElement = selectHeader.nextElementSibling
    const headerFixed = () => {
      if ((headerOffset - window.scrollY) <= 0) {
        selectHeader.classList.add('fixed-top')
        nextElement.classList.add('scrolled-offset')
      } else {
        selectHeader.classList.remove('fixed-top')
        nextElement.classList.remove('scrolled-offset')
      }
    }
    window.addEventListener('load', headerFixed)
    onscroll(document, headerFixed)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function (e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bx-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function (e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bx-menu')
      }
      scrollto(this.hash)
    }
  }, true)


  const notice = () => {
    const todaynoticediv = document.querySelector('#todaynoticediv');
    const dailynoticediv = document.querySelector('#dailynoticediv');
    const todaydatep = document.querySelector('#todaydatep');

    let covidjson = '../data/covidnotice.json'

    const mr = new Request(covidjson);
    let dailynotice = '';
    fetch(mr)
      .then(response => response.json())
      .then(data => {
        let daily = data.daily;

        for (let i of daily) {
          let daten = i.d.toString()
          let descn = i.n.toString()
          descn = descn.replaceAll('\n', '<br/>');
          let dn = `
          <div class="col-md-6 col-lg-3 d-flex align-items-stretch mb-3 mb-lg-0">
            <div class="icon-box" data-aos="fade-up" data-aos-delay="100">
              <p class="description"><span class="datebadge">${daten}</span>${descn}</p>
              
            </div>
          </div>
        `
          dailynotice += dn;
        }
        dailynoticediv.innerHTML = dailynotice;

        for (let i of daily) {
          if(i.h && i.h === true && i.a === 2) {
            todayxianyidatep.innerHTML = i.d.toString();
            todayxianyinoticediv.innerHTML = i.n.toString().replaceAll('\n', '<br/>');
          }
        }

        for (let i of daily) {
          if(i.h && i.h === true && i.a === 1) {
            todaydatep.innerHTML = i.d.toString();
            todaynoticediv.innerHTML = i.n.toString().replaceAll('\n', '<br/>');
          }
        }
 

      });
  }
  document.addEventListener('DOMContentLoaded', notice, false);

  const navtime = () => {
    const navtimediv = document.querySelector('#time');
    let d = new Date();
    navtimediv.innerHTML = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }

  document.addEventListener('DOMContentLoaded', navtime, false);

  const coviddata = () => {
    const coviddatadiv = document.querySelector('#coviddatadiv');
    let covidjson = '../data/coviddata.json'

    const fuerdata = document.querySelector('#fuerdata');
    const xianyidata = document.querySelector('#xianyidata');
    const maoxindata = document.querySelector('#maoxindata');

    const mr = new Request(covidjson);
    fetch(mr)
      .then(response => response.json())
      .then(data => {

        let f150 = '', s386 = '', s388 = '', s408 = '', s414 = '', s417 = '', s450 = '', x415 = '', x435 = '', x451 = '', x471 = '', m455 = '';

        if (data.f150[0].length > 0) {
          f150 = ` 
      <div class="col-4 col-lg-3 col-md-6">
        <div class="section-title covid-icon-box">
          <h2>芙二小区</h2>
          <h2>芙蓉江路150弄</h2>
          <p>${data.f150}</p>
        </div>
      </div>
      `}

        if (data.s386[0].length > 0) {
          s386 = `<div class="col-4 col-lg-3 col-md-6">
    <div class="section-title covid-icon-box">
      <h2>仙逸小区</h2>
      <h2>水城路386弄</h2>
      <p>${data.s386}</p>
    </div>
  </div>`}

        if (data.s388[0].length > 0) {
          s388 = `<div class="col-4 col-lg-3 col-md-6">
    <div class="section-title covid-icon-box">
      <h2>仙逸小区</h2>
      <h2>水城路388弄</h2>
      <p>${data.s388}</p>
    </div>
  </div>`}

        if (data.s408[0].length > 0) {
          s408 = `<div class="col-4 col-lg-3 col-md-6">
    <div class="section-title covid-icon-box">
      <h2>仙逸小区</h2><h2>水城路408弄</h2>
      <p>${data.s408}</p>
    </div>
  </div>`}

        if (data.s414[0].length > 0) {
          s414 = `<div class="col-4 col-lg-3 col-md-6">
    <div class="section-title covid-icon-box">
      <h2>仙逸小区</h2><h2>水城路414弄</h2>
      <p>${data.s414}</p>
    </div>
  </div>`}

        if (data.s417[0].length > 0) {
          s417 = `<div class="col-4 col-lg-3 col-md-6">
    <div class="section-title covid-icon-box">
      <h2>仙逸小区</h2><h2>水城路417弄</h2>
      <p>${data.s417}</p>
    </div>
  </div>`}

        if (data.s450[0].length > 0) {
          s450 = `<div class="col-4 col-lg-3 col-md-6">
    <div class="section-title covid-icon-box">
      <h2>仙逸小区</h2><h2>水城路450弄</h2>
      <p>${data.s450}</p>
    </div>
  </div>`}

        if (data.x415[0].length > 0) {
          x415 = `<div class="col-4 col-lg-3 col-md-6">
    <div class="section-title covid-icon-box">
      <h2>仙逸小区</h2><h2>仙霞路415弄</h2>
      <p>${data.x415}</p>
    </div>
  </div>`}

        if (data.x435[0].length > 0) {
          x435 = `<div class="col-4 col-lg-3 col-md-6">
    <div class="section-title covid-icon-box">
      <h2>仙逸小区</h2><h2>仙霞路435弄</h2>
      <p>${data.x435}</p>
    </div>
  </div>`}

        if (data.x451[0].length > 0) {
          x451 = `<div class="col-4 col-lg-3 col-md-6">
    <div class="section-title covid-icon-box">
      <h2>仙逸小区</h2><h2>仙霞路451弄</h2>
      <p>${data.x451}</p>
    </div>
  </div>`}

        if (data.x471[0].length > 0) {
          x471 = `<div class="col-4 col-lg-3 col-md-6">
    <div class="section-title covid-icon-box">
      <h2>仙逸小区</h2><h2>仙霞路471弄</h2>
      <p>${data.x471}</p>
    </div>
  </div>`}

        if (data.m455[0].length > 0) {
          m455 = `<div class="col-4 col-lg-3 col-md-6">
    <div class="section-title covid-icon-box">
      <h2>茅台新苑</h2><h2>茅台路455弄</h2>
      <p>${data.m455}</p>
    </div>
  </div>`}

        let s = f150 + s386 + s388 + s408 + s414 + s417 + s450 + x415 + x435 + x451 + x471 + m455
        s = s.replace(/,/g, ' ');
        coviddatadiv.innerHTML = s;

      });
  }

  document.addEventListener('DOMContentLoaded', coviddata, false);

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})()