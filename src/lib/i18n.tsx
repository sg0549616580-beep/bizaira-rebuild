import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "he" | "en";

interface Translations {
  [key: string]: { he: string; en: string };
}

const translations: Translations = {
  // Navigation
  "nav.home": { he: "בית", en: "Home" },
  "nav.create": { he: "יצירה", en: "Create" },
  "nav.dashboard": { he: "האזור שלי", en: "My Area" },
  "nav.support": { he: "תמיכה", en: "Support" },
  "nav.journal": { he: "יומן", en: "Journal" },

  // Home
  "home.hero.title1": { he: "ה-AI שיוצר לעסק שלך", en: "AI That Creates For Your Business" },
  "home.hero.title2": { he: "הכול במקום אחד", en: "Everything In One Place" },
  "home.hero.desc": { he: "יצירת תמונות מוצר, תוכן שיווקי, ניתוח עסקי ועוד — בתוך כמה שניות בלבד בעזרת AI.", en: "Create product photos, marketing content, business analytics and more — in just seconds with AI." },
  "home.slide1.title": { he: "תוכן שיווקי חכם", en: "Smart Marketing Content" },
  "home.slide1.desc": { he: "צרו הודעות שיווקיות מקצועיות, תמונות מוצר ותוכן לרשתות — הכול אוטומטי עם AI.", en: "Create professional marketing messages, product photos and social content — all automated with AI." },
  "home.slide2.title": { he: "תמונות מוצר באיכות גבוהה", en: "High-Quality Product Photos" },
  "home.slide2.desc": { he: "העלו תמונה פשוטה והמערכת תיצור תמונה שיווקית מקצועית מוכנה לפרסום.", en: "Upload a simple photo and the system creates a professional marketing image ready to publish." },
  "home.slide3.title": { he: "ניתוח עסקי ותמחור חכם", en: "Business Analytics & Smart Pricing" },
  "home.slide3.desc": { he: "קבלו תובנות עסקיות, חישוב תמחור מדויק וניהול זמן חכם — הכול במקום אחד.", en: "Get business insights, accurate pricing calculations and smart time management — all in one place." },
  "home.cta.start": { he: "התחל ליצור", en: "Start Creating" },
  "home.cta.auth": { he: "התחברות / הרשמה", en: "Login / Sign Up" },
  "home.tools.title": { he: "הכלים שלך", en: "Your Tools" },

  // Tools
  "tool.video.title": { he: "סרטון תדמית", en: "Promo Video" },
  "tool.video.desc": { he: "סרטון שיווקי מקצועי", en: "Professional marketing video" },
  "tool.notes.title": { he: "יומן / פתקים", en: "Journal / Notes" },
  "tool.notes.desc": { he: "רעיונות ותזכורות", en: "Ideas and reminders" },
  "tool.journal.title": { he: "יומן עסקי", en: "Business Journal" },
  "tool.journal.desc": { he: "משימות, תכנון והתקדמות", en: "Tasks, planning & progress" },
  "tool.photos.title": { he: "סטודיו תמונות", en: "Photo Studio" },
  "tool.photos.desc": { he: "תמונות מוצר, לוגו ופרופיל עסקי", en: "Product photos, logos & business profiles" },
  "tool.messages.title": { he: "הודעות AI", en: "AI Messages" },
  "tool.messages.desc": { he: "ניסוח שיווקי חכם", en: "Smart marketing copy" },
  "tool.analytics.title": { he: "ניתוח עסקי", en: "Business Analytics" },
  "tool.analytics.desc": { he: "תובנות ומסקנות חכמות", en: "Smart insights and conclusions" },
  "tool.time.title": { he: "ניהול זמן", en: "Time Management" },
  "tool.time.desc": { he: "אופטימיזציה חכמה", en: "Smart optimization" },
  "tool.pricing.title": { he: "תמחור חכם", en: "Smart Pricing" },
  "tool.pricing.desc": { he: "אסטרטגיית מחירים", en: "Pricing strategy" },
  "tool.studio.title": { he: "סטודיו תמונות", en: "Photo Studio" },
  "tool.studio.desc": { he: "תמונות מוצר, לוגו, פרופיל עסקי וסטורי", en: "Product photos, logos, profiles & stories" },

  // Create Page
  "create.title": { he: "סטודיו יצירה", en: "Creation Studio" },
  "create.describe": { he: "תאר את מה שתרצה ליצור", en: "Describe what you want to create" },
  "create.placeholder": { he: "לדוגמה: סרטון תדמית לעסק של עיצוב פנים, בסגנון מודרני ויוקרתי...", en: "Example: a promo video for an interior design business, in a modern and luxurious style..." },
  "create.style": { he: "סגנון עיצוב", en: "Design Style" },
  "create.generating": { he: "יוצר עם AI...", en: "Creating with AI..." },
  "create.generate": { he: "צור עם AI", en: "Create with AI" },
  "create.result": { he: "התוצאה שלך", en: "Your Result" },
  "create.preview": { he: "תצוגה מקדימה של התוצאה", en: "Preview of the result" },
  "create.styleLabel": { he: "סגנון", en: "Style" },
  "create.copy": { he: "העתק", en: "Copy" },
  "create.download": { he: "הורדה", en: "Download" },
  "create.save": { he: "שמירה", en: "Save" },

  // Styles
  "style.luxury": { he: "יוקרתי", en: "Luxury" },
  "style.modern": { he: "מודרני", en: "Modern" },
  "style.clean": { he: "נקי", en: "Clean" },
  "style.emotional": { he: "רגשי", en: "Emotional" },
  "style.young": { he: "צעיר", en: "Young" },
  "style.elegant": { he: "אלגנטי", en: "Elegant" },

  // Video Studio
  "video.title": { he: "סטודיו סרטון תדמית", en: "Promo Video Studio" },
  "video.subtitle": { he: "יצירת סרטון ברמת אולפן מקצועי", en: "Create studio-level professional videos" },
  "video.preview": { he: "תצוגה מקדימה חיה", en: "Live Preview" },
  "video.step.business": { he: "פרטי העסק", en: "Business Details" },
  "video.step.business.desc": { he: "שם, תחום וסלוגן", en: "Name, field and slogan" },
  "video.step.images": { he: "תמונות", en: "Images" },
  "video.step.images.desc": { he: "לוגו ותמונות מוצר", en: "Logo and product images" },
  "video.step.texts": { he: "טקסטים", en: "Texts" },
  "video.step.texts.desc": { he: "ניסוח שיווקי חכם", en: "Smart marketing copy" },
  "video.step.style": { he: "סגנון עיצוב", en: "Design Style" },
  "video.step.style.desc": { he: "אופי ויזואלי", en: "Visual character" },
  "video.step.music": { he: "מוזיקה", en: "Music" },
  "video.step.music.desc": { he: "פסקול מותאם", en: "Custom soundtrack" },
  "video.step.duration": { he: "אורך וקצב", en: "Length & Pace" },
  "video.step.duration.desc": { he: "משך הסרטון", en: "Video duration" },
  "video.businessName": { he: "שם העסק *", en: "Business Name *" },
  "video.businessName.ph": { he: "לדוגמה: סטודיו לאנה", en: "Example: Studio Lana" },
  "video.businessField": { he: "תחום העסק", en: "Business Field" },
  "video.businessField.ph": { he: "לדוגמה: עיצוב פנים", en: "Example: Interior Design" },
  "video.slogan": { he: "סלוגן (אופציונלי)", en: "Slogan (optional)" },
  "video.slogan.ph": { he: "לדוגמה: הבית שלך, החלום שלנו", en: "Example: Your Home, Our Dream" },
  "video.uploadImages": { he: "ה��לה עד 2 תמונות (לוגו + תמונת מוצר)", en: "Upload up to 2 images (logo + product photo)" },
  "video.upload": { he: "העלאה", en: "Upload" },
  "video.textStyle": { he: "סגנון ניסוח", en: "Writing Style" },
  "video.freeText": { he: "טקסט חופשי", en: "Free Text" },
  "video.freeText.ph": { he: "כתוב כאן את הטקסט שתרצה שיופיע בסרטון, או תן ל-AI לנסח בשבילך...", en: "Write the text you want in the video, or let AI write it for you..." },
  "video.aiWrite": { he: "נסח לי עם AI", en: "Write with AI" },
  "video.generating": { he: "מייצר סרטון...", en: "Generating video..." },
  "video.generate": { he: "צור סרטון תדמית", en: "Create Promo Video" },
  "video.ready": { he: "הסרטון מוכן!", en: "Video is ready!" },
  "video.downloadMp4": { he: "הורדת MP4", en: "Download MP4" },
  "video.share": { he: "שיתוף", en: "Share" },
  "video.textEmotional": { he: "רגשי", en: "Emotional" },
  "video.textLuxury": { he: "יוקרתי", en: "Luxury" },
  "video.textSales": { he: "מכירתי", en: "Sales" },
  "video.textFormal": { he: "רשמי", en: "Formal" },
  "video.musicCalm": { he: "רגועה", en: "Calm" },
  "video.musicCalmDesc": { he: "פסנתר ומיתרים", en: "Piano and strings" },
  "video.musicInspiring": { he: "השראתית", en: "Inspiring" },
  "video.musicInspiringDesc": { he: "אנרגטי ומעורר", en: "Energetic and uplifting" },
  "video.musicHappy": { he: "שמחה", en: "Happy" },
  "video.musicHappyDesc": { he: "קליל ופופי", en: "Light and pop" },
  "video.musicLuxury": { he: "יוקרתית", en: "Luxury" },
  "video.musicLuxuryDesc": { he: "אלקטרוני עדין", en: "Soft electronic" },
  "video.durationShort": { he: "קצר", en: "Short" },
  "video.durationMedium": { he: "בינוני", en: "Medium" },
  "video.durationLong": { he: "ארוך", en: "Long" },
  "video.seconds": { he: "שניות", en: "seconds" },
  "video.upToMinute": { he: "עד דקה", en: "Up to 1 min" },
  "video.scenes": { he: "סצנות", en: "scenes" },
  "video.styleGold": { he: "זהב, כהה, פרימיום", en: "Gold, dark, premium" },
  "video.styleWhite": { he: "לבן, מינימלי, מרווח", en: "White, minimal, spacious" },
  "video.stylePurple": { he: "סגול, חם, אינטימי", en: "Purple, warm, intimate" },
  "video.styleBlue": { he: "כחול, חד, טכנולוגי", en: "Blue, sharp, tech" },
  "video.styleColorful": { he: "צבעוני, דינמי, נועז", en: "Colorful, dynamic, bold" },
  "video.styleBrown": { he: "חום, רך, קלאסי", en: "Brown, soft, classic" },



  // Product Photo Studio
  "photo.title": { he: "סטודיו תמונות", en: "Photo Studio" },
  "photo.subtitle": { he: "תמונות ברמת צלם מקצועי", en: "Professional photographer-level photos" },
  "photo.beforeAfter": { he: "לפני / אחרי", en: "Before / After" },
  "photo.uploadStart": { he: "העלה תמונה כדי להתחיל", en: "Upload an image to start" },
  "photo.upload": { he: "העלאת תמונה", en: "Upload Image" },
  "photo.clickUpload": { he: "לחצו להעלאה", en: "Click to upload" },
  "photo.bgSelect": { he: "בחירת רקע", en: "Choose Background" },
  "photo.bgCustom": { he: "או תאר רקע מותאם...", en: "Or describe a custom background..." },
  "photo.lighting": { he: "תאורה ואווירה", en: "Lighting & Mood" },
  "photo.brightness": { he: "בהירות", en: "Brightness" },
  "photo.contrast": { he: "קונטרסט", en: "Contrast" },
  "photo.warmth": { he: "חמימות", en: "Warmth" },
  "photo.aiEnhance": { he: "AI Enhance", en: "AI Enhance" },
  "photo.elements": { he: "אלמנטים גרפיים", en: "Graphic Elements" },
  "photo.processing": { he: "משדרג...", en: "Enhancing..." },
  "photo.enhance": { he: "שדרג תמונה", en: "Enhance Image" },
  "photo.bgWhite": { he: "סטודיו לבן", en: "White Studio" },
  "photo.bgDark": { he: "יוקרתי כהה", en: "Dark Luxury" },
  "photo.bgNature": { he: "טבעי", en: "Natural" },
  "photo.bgOffice": { he: "משרד מודרני", en: "Modern Office" },
  "photo.noiseReduction": { he: "ניקוי רעש", en: "Noise Reduction" },
  "photo.sharpening": { he: "חידוד קצוות", en: "Edge Sharpening" },
  "photo.textures": { he: "שיפור טקסטורות", en: "Texture Enhancement" },
  "photo.colorBalance": { he: "איזון צבעים", en: "Color Balance" },
  "photo.priceLabel": { he: "כיתוב מחיר", en: "Price Label" },
  "photo.marketingText": { he: "טקסט שיווקי", en: "Marketing Text" },
  "photo.newTag": { he: 'תגית "חדש"', en: '"New" Tag' },
  "photo.shadow": { he: "צל גרפי", en: "Graphic Shadow" },

  // AI Messages
  "msg.title": { he: "הודעות AI", en: "AI Messages" },
  "msg.subtitle": { he: "ניסוח שיווקי ברמת קופירייטר", en: "Copywriter-level marketing copy" },
  "msg.purpose": { he: "מטרת ההודעה", en: "Message Purpose" },
  "msg.tone": { he: "סגנון ניסוח", en: "Writing Tone" },
  "msg.audience": { he: "למי מיועדת ההודעה?", en: "Who is the message for?" },
  "msg.audience.ph": { he: "לדוגמה: לקוחות קיימים, לידים חדשים...", en: "Example: existing clients, new leads..." },
  "msg.keyPoints": { he: "נקודות חשובות לכלול", en: "Key Points to Include" },
  "msg.keyPoints.ph": { he: "מה חשוב שיופיע בהודעה? מבצע, תאריך, פרטים מיוחדים...", en: "What should appear? Promotions, dates, special details..." },
  "msg.generating": { he: "מנסח...", en: "Writing..." },
  "msg.generate": { he: "נסח הודעה", en: "Write Message" },
  "msg.result": { he: "ההודעה שלך", en: "Your Message" },
  "msg.copied": { he: "הועתק!", en: "Copied!" },
  "msg.copy": { he: "העתק", en: "Copy" },
  "msg.rewrite": { he: "נסח מחדש", en: "Rewrite" },
  "msg.shorter": { he: "גרסה קצרה יותר", en: "Shorter version" },
  "msg.moreEmotional": { he: "גרסה רגשית יותר", en: "More emotional" },
  "msg.variations": { he: "3 וריאציות", en: "3 Variations" },
  "msg.purposeSale": { he: "הודעת מכירה", en: "Sales Message" },
  "msg.purposeService": { he: "הודעת שירות", en: "Service Message" },
  "msg.purposeReminder": { he: "תזכורת", en: "Reminder" },
  "msg.purposePost": { he: "פוסט לרשתות", en: "Social Post" },
  "msg.purposeCollection": { he: "תזכורת תשלום", en: "Payment Reminder" },
  "msg.purposeLaunch": { he: "הודעת השקה", en: "Launch Message" },
  "msg.toneFormal": { he: "רשמי", en: "Formal" },
  "msg.toneWarm": { he: "חמים", en: "Warm" },
  "msg.toneMarketing": { he: "שיווקי", en: "Marketing" },
  "msg.toneEmotional": { he: "רגשי", en: "Emotional" },
  "msg.toneShort": { he: "קצר ומדויק", en: "Short & Precise" },
  "msg.toneLuxury": { he: "יוקרתי", en: "Luxury" },

  // Business Analytics
  "analytics.title": { he: "ניתוח עסקי חכם", en: "Smart Business Analytics" },
  "analytics.subtitle": { he: "AI Business Brain", en: "AI Business Brain" },
  "analytics.revenue": { he: "הכנסות החודש", en: "Monthly Revenue" },
  "analytics.profit": { he: "רווח נקי", en: "Net Profit" },
  "analytics.newClients": { he: "לקוחות חדשים", en: "New Clients" },
  "analytics.closeRate": { he: "אחוז סגירה", en: "Close Rate" },
  "analytics.insights": { he: "תובנות חכמות", en: "Smart Insights" },
  "analytics.profitByService": { he: "רווחיות לפי שירות", en: "Profitability by Service" },
  "analytics.hours": { he: "שעות", en: "hours" },
  "analytics.profitability": { he: "רווחיות", en: "Profitability" },
  "analytics.askAi": { he: "שאל את ה-AI", en: "Ask AI" },
  "analytics.askPh": { he: "למה החודש היה חלש? מה הכי רווחי?", en: "Why was this month weak? What's most profitable?" },
  "analytics.ask": { he: "שאל", en: "Ask" },
  "analytics.proFeatures": { he: "תכונות PRO", en: "PRO Features" },
  "analytics.forecast": { he: "חיזוי הכנסות", en: "Revenue Forecast" },
  "analytics.simulations": { he: "סימולציות מחיר", en: "Price Simulations" },
  "analytics.multiYear": { he: "ניתוח רב-שנתי", en: "Multi-year Analysis" },
  "analytics.breakeven": { he: "נקודת איזון", en: "Break-even Point" },

  // Time Optimizer
  "time.title": { he: "ניהול זמן חכם", en: "Smart Time Management" },
  "time.subtitle": { he: "AI Time Optimizer", en: "AI Time Optimizer" },
  "time.weeklyHours": { he: "שעות השבוע", en: "Weekly Hours" },
  "time.avgHourlyValue": { he: "ערך שעה ממוצע", en: "Avg Hourly Value" },
  "time.loadIndex": { he: "מדד עומס", en: "Load Index" },
  "time.overloaded": { he: "יום שלישי עמוס מדי", en: "Tuesday is overloaded" },
  "time.overloadedDesc": { he: "6 פגישות רצופות ללא הפסקה — מומלץ לפצל לפחות אחת ליום אחר.", en: "6 consecutive meetings without a break — consider splitting at least one to another day." },
  "time.weeklyCalendar": { he: "יומן שבועי", en: "Weekly Calendar" },
  "time.profitable": { he: "רווחי", en: "Profitable" },
  "time.regular": { he: "רגיל", en: "Regular" },
  "time.low": { he: "נמוך", en: "Low" },
  "time.buildWeek": { he: "בנה לי שבוע מאוזן", en: "Build Me a Balanced Week" },
  "time.timeInsights": { he: "תובנות זמן", en: "Time Insights" },
  "time.days.sun": { he: "ראשון", en: "Sun" },
  "time.days.mon": { he: "שני", en: "Mon" },
  "time.days.tue": { he: "שלישי", en: "Tue" },
  "time.days.wed": { he: "רביעי", en: "Wed" },
  "time.days.thu": { he: "חמישי", en: "Thu" },
  "time.proLoadForecast": { he: "חיזוי עומסים", en: "Load Forecast" },
  "time.proServiceSim": { he: "סימולציית שירות", en: "Service Simulation" },
  "time.proProfitDay": { he: "ניתוח רווח/יום", en: "Profit/Day Analysis" },
  "time.proPricingRec": { he: "המלצות תמחור", en: "Pricing Recommendations" },

  // Pricing Strategist
  "pricing.stTitle": { he: "תמחור חכם", en: "Smart Pricing" },
  "pricing.stSubtitle": { he: "AI Pricing Strategist", en: "AI Pricing Strategist" },
  "pricing.calculator": { he: "מחשבון תמחור", en: "Pricing Calculator" },
  "pricing.duration": { he: "משך שירות (דקות)", en: "Service Duration (min)" },
  "pricing.materials": { he: "עלות חומרים (₪)", en: "Material Cost (₪)" },
  "pricing.prepTime": { he: "זמן הכנה (דקות)", en: "Prep Time (min)" },
  "pricing.fixedExpenses": { he: "הוצאות קבועות/חודש", en: "Fixed Expenses/month" },
  "pricing.desiredProfit": { he: "יעד רווחיות", en: "Profitability Target" },
  "pricing.calculate": { he: "חשב תמחור אסטרטגי", en: "Calculate Strategic Pricing" },
  "pricing.minPrice": { he: "מחיר מינימום", en: "Minimum Price" },
  "pricing.recommended": { he: "מחיר מומלץ", en: "Recommended Price" },
  "pricing.premium": { he: "מחיר פרימיום", en: "Premium Price" },
  "pricing.notRecommended": { he: "לא מומלץ", en: "Not recommended" },
  "pricing.recommendedLabel": { he: "מומלץ", en: "Recommended" },
  "pricing.highPositioning": { he: "מיצוב גבוה", en: "High positioning" },
  "pricing.hourlyValue": { he: "ערך שעת עבודה", en: "Hourly Work Value" },
  "pricing.insights": { he: "תובנות", en: "Insights" },
  "pricing.proCompetitors": { he: "ניתוח מתחרים", en: "Competitor Analysis" },
  "pricing.proSimulations": { he: "סימולציות מחיר", en: "Price Simulations" },
  "pricing.proPsychology": { he: "פסיכולוגיית מחיר", en: "Price Psychology" },
  "pricing.proPositioning": { he: "אסטרטגיית מיצוב", en: "Positioning Strategy" },

  // Image Studio
  "imgStudio.title": { he: "סטודיו תמונות מתקדם", en: "Advanced Image Studio" },
  "imgStudio.subtitle": { he: "AI Image Studio", en: "AI Image Studio" },
  "imgStudio.preview": { he: "תצוגה מקדימה", en: "Preview" },
  "imgStudio.uploadStart": { he: "העלה תמונה כדי להתחיל", en: "Upload an image to start" },
  "imgStudio.upload": { he: "העלאת תמונה", en: "Upload Image" },
  "imgStudio.clickUpload": { he: "לחצו להעלאה", en: "Click to upload" },
  "imgStudio.imageType": { he: "סוג תמונה", en: "Image Type" },
  "imgStudio.style": { he: "סגנון עיצוב", en: "Design Style" },
  "imgStudio.bgSelect": { he: "בחירת רקע", en: "Choose Background" },
  "imgStudio.bgCustom": { he: "או תאר רקע מותאם...", en: "Or describe a custom background..." },
  "imgStudio.lighting": { he: "תאורה", en: "Lighting" },
  "imgStudio.brightness": { he: "בהירות", en: "Brightness" },
  "imgStudio.contrast": { he: "קונטרסט", en: "Contrast" },
  "imgStudio.elements": { he: "אלמנטים גרפיים", en: "Graphic Elements" },
  "imgStudio.processing": { he: "מעבד...", en: "Processing..." },
  "imgStudio.generate": { he: "צור 4 גרסאות", en: "Create 4 Versions" },
  "imgStudio.downloadAll": { he: "הורדת כל הגרסאות", en: "Download All Versions" },
  "imgStudio.typeProduct": { he: "תמונת מוצר", en: "Product Photo" },
  "imgStudio.typeProfile": { he: "תמונת פרופיל", en: "Profile Photo" },
  "imgStudio.typeLogo": { he: "לוגו", en: "Logo" },
  "imgStudio.styleClean": { he: "נקי", en: "Clean" },
  "imgStudio.styleLuxury": { he: "יוקרתי", en: "Luxury" },
  "imgStudio.styleNatural": { he: "טבעי", en: "Natural" },
  "imgStudio.styleUrban": { he: "אורבני", en: "Urban" },
  "imgStudio.styleSoft": { he: "רך", en: "Soft" },
  "imgStudio.styleModern": { he: "מודרני", en: "Modern" },
  "imgStudio.bgStudio": { he: "סטודיו", en: "Studio" },
  "imgStudio.bgOffice": { he: "משרד", en: "Office" },
  "imgStudio.bgNature": { he: "טבע", en: "Nature" },
  "imgStudio.bgSolid": { he: "צבע אחיד", en: "Solid Color" },
  "imgStudio.elPrice": { he: "כיתוב מחיר", en: "Price Label" },
  "imgStudio.elMarketing": { he: "טקסט שיווקי", en: "Marketing Text" },
  "imgStudio.elNew": { he: 'תגית "חדש"', en: '"New" Tag' },
  "imgStudio.elShadow": { he: "צל גרפי", en: "Graphic Shadow" },
  "imgStudio.elFrame": { he: "מסגרת עדינה", en: "Subtle Frame" },
  "imgStudio.elWatermark": { he: "לוגו מים", en: "Watermark Logo" },

  // Support
  "support.title": { he: "תמיכה", en: "Support" },
  "support.subtitle": { he: "נשמח לעזור! שלחו פנייה או חפשו בשאלות הנפוצות.", en: "We'd love to help! Send us a message or browse the FAQ." },
  "support.contact": { he: "צור קשר", en: "Contact Us" },
  "support.name": { he: "שם", en: "Name" },
  "support.email": { he: "אימייל", en: "Email" },
  "support.message": { he: "ההודעה שלך...", en: "Your message..." },
  "support.send": { he: "שלח פנייה", en: "Send Message" },
  "support.faq": { he: "שאלות נפוצות", en: "FAQ" },
  "support.features": { he: "מה אפשר לעשות עם BizAIra", en: "What You Can Do With BizAIra" },
  "support.export": { he: "הורד כ-PDF", en: "Download as PDF" },

  // Features descriptions
  "feature.video.title": { he: "סרטון תדמית לעסק", en: "Business Promo Video" },
  "feature.video.1": { he: "מכניסים פרטים בסיסיים של העסק — שם, תחום וסלוגן.", en: "Enter basic business details — name, field and slogan." },
  "feature.video.2": { he: "אפשרות להעלות עד 2 תמונות של העסק.", en: "Option to upload up to 2 business images." },
  "feature.video.3": { he: "בחירת סגנון עיצוב, מוזיקה ואורך סרטון.", en: "Choose design style, music and video length." },
  "feature.video.4": { he: "התוכנה יוצרת סרטון קצר מקצועי מוכן לפרסום.", en: "The software creates a short professional video ready for publishing." },
  "feature.studio.title": { he: "סטודיו תמונות", en: "Photo Studio" },
  "feature.studio.1": { he: "בוחרים סוג — תמונת מוצר, לוגו, פרופיל עסקי או סטורי.", en: "Choose type — product photo, logo, business profile or story." },
  "feature.studio.2": { he: "מעלים תמונה או נותנים ל-AI ליצור מאפס.", en: "Upload a photo or let AI create from scratch." },
  "feature.studio.3": { he: "בוחרים סגנון עיצוב וצבע רקע מותאם.", en: "Choose design style and custom background color." },
  "feature.studio.4": { he: "המערכת יוצרת תמונה מקצועית מוכנה לשיווק.", en: "The system creates a professional marketing-ready image." },
  "feature.product.title": { he: "תמונות מוצר", en: "Product Photos" },
  "feature.product.1": { he: "מכניסים תמונה לא איכותית של המוצר או רק לוגו.", en: "Upload a low-quality product image or just a logo." },
  "feature.product.2": { he: "בוחרים רקע — סטודיו, יוקרתי, טבעי או מותאם אישית.", en: "Choose background — studio, luxury, natural or custom." },
  "feature.product.3": { he: "שליטה בתאורה, חדות, קונטרסט וחמימות.", en: "Control lighting, sharpness, contrast and warmth." },
  "feature.product.4": { he: "המערכת יוצרת תמונה איכותית מוכנה לשיווק.", en: "The system creates a high-quality marketing-ready image." },
  "feature.messages.title": { he: "הודעות AI", en: "AI Messages" },
  "feature.messages.1": { he: "בוחרים מטרה — מכירה, שירות, תזכורת, פוסט, גבייה או השקה.", en: "Choose purpose — sales, service, reminder, post, collection or launch." },
  "feature.messages.2": { he: "בוחרים סגנון — רשמי, חמים, שיווקי, רגשי או יוקרתי.", en: "Choose tone — formal, warm, marketing, emotional or luxury." },
  "feature.messages.3": { he: "המערכת מייצרת ניסוח מקצועי עם מבנה שיווקי נכון.", en: "The system generates professional copy with proper marketing structure." },
  "feature.messages.4": { he: "אפשרות להעתיק, לערוך או לבקש וריאציות נוספות.", en: "Option to copy, edit or request additional variations." },
  "feature.analytics.title": { he: "ניתוח עסקי", en: "Business Analytics" },
  "feature.analytics.1": { he: "דשבורד חכם עם הכנסות, רווח, שירות מוביל ולקוחות.", en: "Smart dashboard with revenue, profit, top service and clients." },
  "feature.analytics.2": { he: "תובנות AI שמסבירות מגמות ומציעות פעולות.", en: "AI insights that explain trends and suggest actions." },
  "feature.analytics.3": { he: "ניתוח רווחיות אמיתי לפי שירות וזמן עבודה.", en: "Real profitability analysis by service and work time." },
  "feature.analytics.4": { he: "אפשרות לשאול שאלות חופשיות ולקבל תשובות מנומקות.", en: "Ask free-form questions and get reasoned answers." },
  "feature.time.title": { he: "ניהול זמן חכם", en: "Smart Time Management" },
  "feature.time.1": { he: "יומן חכם עם פגישות מסודרות לפי סוג שירות ורווחיות.", en: "Smart calendar with meetings sorted by service type and profitability." },
  "feature.time.2": { he: "מדד שחיקה שמתריע על עומס יתר.", en: "Burnout meter that warns about overload." },
  "feature.time.3": { he: "חישוב ערך שעת עבודה אמיתי.", en: "Real hourly work value calculation." },
  "feature.time.4": { he: "תכנון שבוע אוטומטי מאוזן בלחיצה.", en: "Automatic balanced week planning with one click." },
  "feature.pricing.title": { he: "תמחור חכם", en: "Smart Pricing" },
  "feature.pricing.1": { he: "מזינים משך שירות, עלות חומרים, זמן הכנה והוצאות.", en: "Enter service duration, material cost, prep time and expenses." },
  "feature.pricing.2": { he: "המערכת מחשבת מחיר מינימום, מומלץ ופרימיום.", en: "The system calculates minimum, recommended and premium prices." },
  "feature.pricing.3": { he: "סימולציות — מה קורה אם מעלים או מורידים מחיר.", en: "Simulations — what happens if you raise or lower prices." },
  "feature.pricing.4": { he: "המלצות אסטרטגיות לשיפור רווחיות ומיצוב.", en: "Strategic recommendations for profitability and positioning." },
  "feature.imagestudio.title": { he: "סטודיו תמונות מתקדם", en: "Advanced Image Studio" },
  "feature.imagestudio.1": { he: "העלאת תמונת מוצר, לוגו או פרופיל לשדרוג.", en: "Upload product photo, logo or profile for enhancement." },
  "feature.imagestudio.2": { he: "בחירת סגנון עיצוב ורקע מתוך מגוון אפשרויות.", en: "Choose design style and background from various options." },
  "feature.imagestudio.3": { he: "המערכת מייצרת מספר גרסאות לבחירה.", en: "The system generates multiple versions to choose from." },
  "feature.imagestudio.4": { he: "הורדה כתמונות בודדות או כקטלוג PDF מסודר.", en: "Download as individual images or an organized PDF catalog." },

  // Dashboard
  "dash.greeting": { he: "היי, שיראל", en: "Hi, Shiral" },
  "dash.welcome": { he: "ברוכה השבה לסטודיו שלך", en: "Welcome back to your studio" },
  "dash.plan": { he: "מסלול נוכחי", en: "Current Plan" },
  "dash.upgrade": { he: "שדרג ל-PRO", en: "Upgrade to PRO" },
  "dash.credits": { he: "קרדיטים", en: "Credits" },
  "dash.renewal": { he: "חידוש", en: "Renewal" },
  "dash.activity": { he: "פעילות אחרונה", en: "Recent Activity" },
  "dash.creations": { he: "יצירות שבוצעו", en: "Creations made" },
  "dash.downloads": { he: "הורדות", en: "Downloads" },
  "dash.quickActions": { he: "פעולות מהירות", en: "Quick Actions" },
  "dash.startCreate": { he: "התחל ליצור", en: "Start Creating" },
  "dash.startCreateDesc": { he: "תמונות, הודעות, ניתוח ועוד", en: "Photos, messages, analytics and more" },
  "dash.manageSub": { he: "ניהול מנוי", en: "Manage Subscription" },
  "dash.manageSubDesc": { he: "שדרוג, תשלומים וחשבוניות", en: "Upgrades, payments and invoices" },
  "dash.supportTitle": { he: "תמיכה", en: "Support" },
  "dash.supportDesc": { he: "צור קשר א�� מצא תשובות", en: "Contact us or find answers" },

  // Pricing Page
  "pricing.title": { he: "בחר את המסלול שלך", en: "Choose Your Plan" },
  "pricing.subtitle": { he: "שדרג את העסק שלך עם כלי AI מתקדמים", en: "Upgrade your business with advanced AI tools" },
  "pricing.startFree": { he: "התחל בחינם", en: "Start Free" },
  "pricing.upgradeNow": { he: "שדרג עכשיו", en: "Upgrade Now" },
  "pricing.popular": { he: "הכי פופולרי", en: "Most Popular" },
  "pricing.footer": { he: "תשלום חד-פעמי לחודש · ללא חיוב אוטומטי · ביטול בכל עת", en: "One-time monthly payment · No auto-charge · Cancel anytime" },

  // Auth
  "auth.welcomeBack": { he: "ברוכים השבים!", en: "Welcome Back!" },
  "auth.joinStudio": { he: "הצטרפו לסטודיו AI המתקדם", en: "Join the Advanced AI Studio" },
  "auth.fullName": { he: "שם מלא", en: "Full Name" },
  "auth.namePlaceholder": { he: "השם שלך", en: "Your name" },
  "auth.emailLabel": { he: "אימייל", en: "Email" },
  "auth.passwordLabel": { he: "סיסמה", en: "Password" },
  "auth.login": { he: "התחבר", en: "Login" },
  "auth.createAccount": { he: "צור חשבון", en: "Create Account" },
  "auth.noAccount": { he: "אין לי חשבון — הרשמה", en: "No account — Sign Up" },
  "auth.hasAccount": { he: "יש לי כבר חשבון — התחברות", en: "Already have an account — Login" },
  "auth.forgotPassword": { he: "שכחתי סיסמה", en: "Forgot Password" },
  "auth.backHome": { he: "חזרה לדף הבית", en: "Back to Home" },

  // FAQ
  "faq.q1": { he: "מה זה BizAIra?", en: "What is BizAIra?" },
  "faq.a1": { he: "BizAIra היא פלטפורמת AI מתקדמת שמאפשרת לבעלי עסקים ליצור תוכן שיווקי מקצועי — תמונות מוצר, הודעות ועוד — בלחיצת כפתור.", en: "BizAIra is an advanced AI platform that enables business owners to create professional marketing content — product photos, messages and more — with the click of a button." },
  "faq.q2": { he: "כמה עולה השירות?", en: "How much does the service cost?" },
  "faq.a2": { he: "יש גרסה חינמית עם 2 יצירות בחודש. מסלול Pro עולה ₪29/חודש ומסלול Business עולה ₪59/חודש — שימוש ללא הגבלה בכל הכלים, ללא סימני מים ובאיכות גבוהה.", en: "There's a free version with 2 creations per month. Pro plan costs $9/month and Business plan costs $19/month — unlimited use of all tools, no watermarks and high quality." },
  "faq.q3": { he: "האם אני צריך ידע טכני?", en: "Do I need technical knowledge?" },
  "faq.a3": { he: "בכלל לא! הממשק תוכנן לפשטות מקסימלית. רק מזינים פרטים, בוחרים סגנון, ולוחצים על ׳צור עם AI׳.", en: "Not at all! The interface is designed for maximum simplicity. Just enter details, choose a style, and click 'Create with AI'." },
  "faq.q4": { he: "איך מבטלים מנוי?", en: "How do I cancel my subscription?" },
  "faq.a4": { he: "התשלום הוא חד-פעמי לחודש בלבד — אין חיוב אוטומטי. ברגע שתרצו להפסיק, פשוט לא משלמים יותר ולא תחויבו שוב. ללא התחייבות.", en: "Payment is a one-time monthly charge — no auto-billing. When you want to stop, simply don't pay again and you won't be charged. No commitment." },
  "faq.q5": { he: "באיזה פורמטים אפשר להוריד?", en: "What formats are available for download?" },
  "faq.a5": { he: "תמונות באיכות גבוהה, חישוב עסקי, תמחור נכון, והכל מותאם לעסק שלך.", en: "High-quality images, business analytics, smart pricing, and everything tailored for your business." },

  // Common
  "common.pro": { he: "PRO", en: "PRO" },
  "common.proOnly": { he: "PRO בלבד", en: "PRO only" },
};

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const I18nContext = createContext<I18nContextType>({
  lang: "he",
  setLang: () => {},
  t: (key) => key,
  dir: "rtl",
});

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("he");

  useEffect(() => {
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  const dir = lang === "he" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>
      <div className={lang === "en" ? "font-display" : "font-heebo"}>
        {children}
      </div>
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);

export const LanguageToggle = () => {
  const { lang, setLang } = useI18n();

  return (
    <button
      onClick={() => setLang(lang === "he" ? "en" : "he")}
      className="bg-card border border-border px-3 py-1.5 rounded-xl text-xs font-bold text-foreground hover:scale-105 transition-all flex items-center gap-1.5 shadow-sm"
      title={lang === "he" ? "Switch to English" : "עבור לעברית"}
    >
      <span className={lang === "he" ? "text-muted-foreground" : "text-primary"}>EN</span>
      <span className="text-muted-foreground">/</span>
      <span className={lang === "he" ? "text-primary" : "text-muted-foreground"}>עב</span>
    </button>
  );
};
