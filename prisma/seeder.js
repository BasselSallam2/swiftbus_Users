import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {

  const ArabicInstuctions = await prisma.arabicInstructions.createMany({
    data: [
      { Instructions: "التأكد من تاريخ وميعاد و اتجاه الرحلة مسئولية الراكب" },
      { Instructions: "الأطفال فوق 4 سنوات تذكرة كاملة ولا يوجد نصف تذكرة" },
      { Instructions: "يحق للراكب اصطحاب عدد 2 شنطة ملابس متوسطة الحجم وما زاد على ذلك يتم تقدير قيمة شحن" },
      { Instructions: "الرجاء المحافظة على التذكرة وتقديمها عند الطلب" },
      { Instructions: "في حالة تسبب الشركة في فقد احد الامتعة يكون الحد الأقصى للتعويض 100 جنية مصري والشركة غير مسئولة عما بداخل الحقائب" },
      { Instructions: "الشركة غير مسئولة عن الامتعة صحبة الراكب داخل صالون السيارة ولا يجوز التعويض عنها" },
      { Instructions: "ممنوع اصطحاب او نقل الحيوانات او الطيور أو الأسماك أو المواد القابلة للاشتعال أو المواد السائلة" }
    ]
  });

  
  const EnglishInstuctions = await prisma.englishInstructions.createMany({
    data: [
      { Instructions: "It is the passenger's responsibility to check the date, time, and direction of the trip" },
      { Instructions: "Children over 4 years old require a full ticket, and there is no half ticket" },
      { Instructions: "The passenger is allowed to carry 2 medium-sized clothing bags, and any excess will be charged" },
      { Instructions: "Please keep the ticket and present it upon request" },
      { Instructions: "In case the company causes the loss of any luggage, the maximum compensation is 100 Egyptian pounds, and the company is not responsible for the contents of the bags" },
      { Instructions: "The company is not responsible for luggage accompanying the passenger inside the vehicle salon and cannot be compensated" },
      { Instructions: "It is forbidden to carry or transport animals, birds, fish, flammable materials, or liquids" }
    ]
  });

  

  const voucher1 = await prisma.voucher.create({data : {
    code : "Swift100" , percentage : 10 , maximum: 100 , avaliable: 3 
  }});

  const voucher2 = await prisma.voucher.create({data : {
    code : "Bassel" , percentage : 5 , maximum: 300 , avaliable: 3 
  }});

  const info = await prisma.info.create({data : {
    email : "SwiftBus@gmail.com" ,
    facebook : "https://www.facebook.com/profile.php?id=61567254821754"
  }});
  const ArabicFront = await prisma.frontpageArabic.create({data : {
    Title1 : "سويفت باص الخيار الامن و الاسرع لك و لاسرتك" ,
    Subtitle1: "رحلات يومية بافضل الاسعار",
    phone : "01070033223",
    WorkingHours: "كل ايام الاسبوع 9 صباحاً - 8 مساءً" ,
    Title2:"احجز رحلتك الان",
    SubTitle2:"احجز رحلتك الان و استمتع بالرحلة",
    RightNumber: "30" ,
    LeftNumber: "50",
    TitleRightNumber: "عدد الرحلات اليومية",
    TitleLeftNumber:" عدد الركاب اليومي",
    SubTitleRightNumber:"رحلات يومية بافضل الاسعار",
    SubTitleLeftNumber:"اكثر من 50 راكب يومياً",
    WhyusTitle:"لماذا تختار سويفت باص",
    RightTopTitle:"رحلات يومية",
    LeftTopTitle:"اسعار منافسة",
    RightDownTitle:"مراكب مكيفة",
    LeftDownTitle:"مراكب مكيفة",
    RightTopSubTitle:"رحلات يومية بافضل الاسعار",
    LeftTopSubTitle:"اسعار منافسة",
    RightDownSubTitle:"مراكب مكيفة",
    LeftDownSubTitle:"مراكب مكيفة",
    FooterTitle:"سويفت باص الاختيار الافضل" ,
    address:"القاهرة - مصر",
  }});


  const Ardabicfreq = await prisma.freqQuestionsArabic.create({data : {
    Title : "نحن هنا للاجابة عن كل اسئلتكم"
  }});

  const ArabicQuestion1 = await prisma.question.createMany({data: [
    {question : "كيف استرد المبلغ المدفوع" , answer : "يتم استرداد المبلغ بالكامل في حالة طلب الاسترداد قبل 24 ساعه" , FreqQuestionsArabic_id : 1},
    {question : "ما هي طرق الدفع المتاحة" , answer :"يوجد لدينا طريقة دفع بالفيزا او فودافون كاش او كاش قبل الرحلة" , FreqQuestionsArabic_id : 1},
    {question : "اريد الاتصال بكم" , answer :"نتشرف باتصالاتكم كل يوم من الساعه 9 صباحا الي 8  مساءً" , FreqQuestionsArabic_id : 1}
  ]});

  const EnglishFront = await prisma.frontpageEnglish.create({data : {
    Title1 : "Swift Bus, the safe and fast choice for you and your family" ,
    Subtitle1: "Daily trips with the best prices",
    phone : "01070033223",
    WorkingHours: "Every day from 9 AM to 8 PM" ,
    Title2:"Book your trip now",
    SubTitle2:"Book your trip now and enjoy the journey",
    RightNumber: "30" ,
    LeftNumber: "50",
    TitleRightNumber: "Number of daily trips",
    TitleLeftNumber:"Number of daily passengers",
    SubTitleRightNumber:"Daily trips with the best prices",
    SubTitleLeftNumber:"More than 50 passengers daily",
    WhyusTitle:"Why choose Swift Bus",
    RightTopTitle:"Daily trips",
    LeftTopTitle:"Competitive prices",
    RightDownTitle:"Air-conditioned vehicles",
    LeftDownTitle:"Air-conditioned vehicles",
    RightTopSubTitle:"Daily trips with the best prices",
    LeftTopSubTitle:"Competitive prices",
    RightDownSubTitle:"Air-conditioned vehicles",
    LeftDownSubTitle:"Air-conditioned vehicles",
    FooterTitle:"Swift Bus, the best choice" ,
    address:"Cairo, Egypt",
  }});


  const Englishfreq = await prisma.freqQuestionsEnglish.create({data : {
    Title : "We are here to answer all your questions"
  }});

  const EnglishQuestion1 = await prisma.question.createMany({data: [
    {question : "How can I get a refund?" , answer : "The full amount will be refunded if the refund is requested 24 hours before the trip" , FreqQuestionsEnglish_id : 1},
    {question : "What are the available payment methods?" , answer :"We offer payment by Visa, Vodafone Cash, or cash before the trip" , FreqQuestionsEnglish_id : 1},
    {question : "I want to contact you" , answer :"We are honored to receive your calls every day from 9 AM to 8 PM" , FreqQuestionsEnglish_id : 1}
  ]});

  const Admin = await prisma.user.create({
    data: {
      email: "Admin@admin.com",
      password: "password hasshed",
      role: "Admin",
    },
  });

  const bus = await prisma.bus.create({
    data: {
      type: "super-jet",
      layout: "layout image",
      seats: 49,
      specialseats: [1],
    },
  });

  const bus2 = await prisma.bus.create({
    data: {
      type: "HI-ACE",
      layout: "layout image",
      seats: 13,
      specialseats: [1],
    },
  });

  const marktinglines = await prisma.marktingLines.createMany({
    data: [
       {Arabiccity : "دهب" , Arabicsubtitle:"رحلات دهب يومية بافضل الاسعار" , Englishcity:"Dahab" , Englishsubtitle: "Daily trips with best prices" , image_path : "assets/images/10.jpg"} ,
       {Arabiccity : "نويبع" , Arabicsubtitle:"شواطئ نويبع الساحرة" , Englishcity:"Nuweiba" , Englishsubtitle: "The charming beaches of Nuweiba" , image_path : "assets/images/20.jpg"},
       {Arabiccity : "طابا" , Arabicsubtitle:"جنة الله علي الارض" , Englishcity:"Taba" , Englishsubtitle: "God’s paradise on earth" , image_path : "assets/images/30.jpg"},
       {Arabiccity : "العين السخنة" , Arabicsubtitle:"شواطئ البحر الاحمر الجميلة" , Englishcity:"Ainsokna" , Englishsubtitle: "Beautiful Red Sea beaches" , image_path : "assets/images/40.jpg"},


    ],
  });

  const city1 = await prisma.city.create({
    data: {
      name: "Cairo", Arabicname: "القاهرة" ,
      stations: {
        create: [
          { name: "Marg", location: "https://maps.app.goo.gl/NT9orgyYVXwC8xgn8"  , address : "علي الدائري بجوار بنزينة الامارات" , Arabicname: "المرج"},
          { name: "Adly Mansor", location: "https://maps.app.goo.gl/7DRaYjr9xYJc6Aot8?g_st=com.google.maps.preview.copy"  , address :  "اول الدائري امام بنزينة وطنية" , Arabicname: "عدلي منصور"},
          { name: "ramsis", location: "https://maps.app.goo.gl/wXq9sMLXAxacKqRX6"  , address : "شارع رمسيس امام مستشفي الهلال الأحمر" , Arabicname: "رمسيس"},
          { name: "Giza", location: "https://maps.app.goo.gl/j7iterHnfppUAzhs6"  , address : "20 شارع مراد امام جوباص" , Arabicname: "الجيزة"},
          { name: "Sakr Quraish", location: "https://maps.app.goo.gl/UWaN3LJ5ak8nWRXcA"  , address : "تحت كوبري المشاه امام موقف الاتوبيس", Arabicname: "صقر قريش"},
        ],
      },
    },
  });

  const city2 = await prisma.city.create({
    data: {
      name: "Minya", Arabicname: "المنيا" ,
      stations: {
        create: [
          { name: "Mallawi", location: "https://maps.app.goo.gl/3293wU4UjohszKBD9"  , address : "كوبري المحطة علي الزراعي" , Arabicname: "ملوي"},
          { name: "Dayr Mawas", location: "https://maps.app.goo.gl/w2WjNDrTPmSJyLFN9"  , address :  "كازينو ديرمواس امام مستشفي ديرمواس التخصصي علي الزراعي" , Arabicname: " دير مواس"},
        ],
      },
    },
  });

  const city3 = await prisma.city.create({
    data: {
      name: "Asyut", Arabicname: "اسيوط" ,
      stations: {
        create: [
          { name: "Dayrout", location: "https://maps.app.goo.gl/BoM6yYuafPabaHFz8"  , address : "كافيتريا دريم عند كوبري المركز  وديروط الشريف" , Arabicname: "ديروط"},
          { name: "Al Qusiyyah", location: "https://maps.app.goo.gl/pnsrmjeWVsujXFNg9"  , address : "عند مطعم صابر امام مصلحة الضرائب علي الزراعي" , Arabicname: "القوصية"},
          { name: "Manfalut", location: "https://goo.gl/maps/KFYEGbZ9tbyGKQAh8"  , address : "امام كافية نقابة المعلمين علي الزراعي امام محطة القطار" , Arabicname: "منفلوط"},
        ],
      },
    },
  });

  const trip1 = await prisma.trip.create({
    data: {
      routes: [city1.id, city2.id, city3.id],
      payment: ["Cash"],
      cahslimit: 4,
      expireHours: 4,
      avaliableseats: 49,
      busid: bus.id,
      rrule: "FREQ=DAILY;DTSTART=20250301T000000Z;UNTIL=20250329T235959Z",
    },
  });

  const trip2 = await prisma.trip.create({
    data: {
      routes: [city3.id, city2.id, city1.id],
      payment: ["Cash"],
      cahslimit: 4,
      expireHours: 4,
      avaliableseats: 49,
      busid: bus.id,
      rrule: "FREQ=DAILY;DTSTART=20250301T000000Z;UNTIL=20250329T235959Z",
    },
  });

  const city1withid = await prisma.city.findUnique({
    where: { id: city1.id },
    include: { stations: true },
  });
  const city2withid = await prisma.city.findUnique({
    where: { id: city2.id },
    include: { stations: true },
  });
  const city3withid = await prisma.city.findUnique({
    where: { id: city3.id },
    include: { stations: true },
  });

  

  const sationdetails1 = await prisma.stationDetails.createMany({
    data: [
      {
        stationId: city1withid.stations[0].id,
        arrivaleTime: "02:00 PM",
        trip_id: trip1.id,
      },
      {
        stationId: city1withid.stations[1].id,
        arrivaleTime: "02:15 PM",
        trip_id: trip1.id,
      },
      {
        stationId: city1withid.stations[2].id,
        arrivaleTime: "03:00 PM",
        trip_id: trip1.id,
      },
      {
        stationId: city1withid.stations[3].id,
        arrivaleTime: "03:30 PM",
        trip_id: trip1.id,
      },
      {
        stationId: city1withid.stations[4].id,
        arrivaleTime: "04:00 PM",
        trip_id: trip1.id,
      },
      {
        stationId: city2withid.stations[0].id,
        arrivaleTime: "08:00 PM",
        trip_id: trip1.id,
      },
      {
        stationId: city2withid.stations[1].id,
        arrivaleTime: "08:30 PM",
        trip_id: trip1.id,
      },
      {
        stationId: city3withid.stations[0].id,
        arrivaleTime: "09:15 PM",
        trip_id: trip1.id,
      },
      {
        stationId: city3withid.stations[1].id,
        arrivaleTime: "10:00 PM",
        trip_id: trip1.id,
      },
      {
        stationId: city3withid.stations[2].id,
        arrivaleTime: "10:30 PM",
        trip_id: trip1.id,
      },
     
     
    ],
  });

  const sationdetails2 = await prisma.stationDetails.createMany({
    data: [
      {
        stationId: city3withid.stations[2].id,
        arrivaleTime: "11:00 PM",
        trip_id: trip2.id,
      },
      {
        stationId: city3withid.stations[1].id,
        arrivaleTime: "11:30 PM",
        trip_id: trip2.id,
      },
      {
        stationId: city3withid.stations[0].id,
        arrivaleTime: "12:15 AM",
        trip_id: trip2.id,
      },
      {
        stationId: city2withid.stations[1].id,
        arrivaleTime: "12:30 PM",
        trip_id: trip2.id,
      },
      {
        stationId: city2withid.stations[0].id,
        arrivaleTime: "01:00 AM",
        trip_id: trip2.id,
      },
      {
        stationId: city1withid.stations[4].id,
        arrivaleTime: "05:45 AM",
        trip_id: trip2.id,
      },
      {
        stationId: city1withid.stations[3].id,
        arrivaleTime: "06:00 AM",
        trip_id: trip2.id,
      },
      {
        stationId: city1withid.stations[2].id,
        arrivaleTime: "06:30 AM",
        trip_id: trip2.id,
      },
      {
        stationId: city1withid.stations[1].id,
        arrivaleTime: "07:15 AM",
        trip_id: trip2.id,
      },
      {
        stationId: city1withid.stations[0].id,
        arrivaleTime: "07:30 PM",
        trip_id: trip2.id,
      },
     
     
    ],
  });

  
  const cost1 = await prisma.cost.createMany({
    data: [
      {
        fromCityId: city1.id,
        toCityId: city2.id,
        fare: 200,
        specialfare: 200,
        trip_id: trip1.id,
        twowaydiscount: 0
      },
      {
        fromCityId: city1.id,
        toCityId: city3.id,
        fare: 200,
        specialfare: 200,
        trip_id: trip1.id,
        twowaydiscount : 0
      },
      {
        fromCityId: city2.id,
        toCityId: city3.id,
        fare: 200,
        specialfare: 200,
        trip_id: trip1.id,
        twowaydiscount : 0
      },
    ],
  });

  const cost2 = await prisma.cost.createMany({
    data: [
      {
        fromCityId: city3.id,
        toCityId: city2.id,
        fare: 200,
        specialfare: 200,
        trip_id: trip2.id,
        twowaydiscount: 0
      },
      {
        fromCityId: city3.id,
        toCityId: city1.id,
        fare: 200,
        specialfare: 200,
        trip_id: trip2.id,
        twowaydiscount : 0
      },
      {
        fromCityId: city2.id,
        toCityId: city1.id,
        fare: 200,
        specialfare: 200,
        trip_id: trip2.id,
        twowaydiscount : 0
      },
    ],
  });



})();
