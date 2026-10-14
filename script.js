/**
 * سكريبت العرض التقديمي الاحترافي (Mechatronics Seminar Script)
 * يتحكم في التنقل بين الـ 11 سلايد، المحاكاة الهندسية، الملاحظات، ونظام الاختبارات التفاعلي.
 */

document.addEventListener('DOMContentLoaded', () => {
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const counterText = document.getElementById('slideCounter');
    const progressBar = document.getElementById('progressBar');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    // عناصر الملاحظات
    const notesToggleBtn = document.getElementById('notesToggleBtn');
    const notesModal = document.getElementById('notesModal');
    const closeNotesBtn = document.getElementById('closeNotesBtn');
    const notesModalBody = document.getElementById('notesModalBody');

    // عناصر الاختبار (Q&A Quiz)
    const openQuizBtn = document.getElementById('openQuizBtn');
    const quizModal = document.getElementById('quizModal');
    const closeQuizBtn = document.getElementById('closeQuizBtn');
    const revealAnsBtn = document.getElementById('revealAnsBtn');
    const nextQBtn = document.getElementById('nextQBtn');
    const qTitle = document.getElementById('qTitle');
    const qOptions = document.getElementById('qOptions');
    const qFeedback = document.getElementById('qFeedback');

    let currentQuestionIndex = 0;

    // بنك الأسئلة الهندسية التفاعلية للطلاب
    const quizQuestions = [
        {
            title: "السؤال الأول: ما هو الدور الأساسي للحساس (Sensor)؟",
            options: [
                "أ. إنتاج حركة ميكانيكية دورانية",
                "ب. جمع المعلومات والقياس من البيئة المحيطة",
                "ج. طلاء المنتجات الصناعية بالرش",
                "د. إمداد النظام بالطاقة الكهربائية الرئيسية"
            ],
            correct: 1, // الخيار الثاني (ب)
            explanation: "الإجابة الصحيحة: (ب) الحساسات تعتبر عيون النظام؛ تقيس المتغيرات البيئية وتحولها لإشارات يفهمها نظام التحكم."
        },
        {
            title: "السؤال الثاني: هل يتطلب كل نظام أتمتة (Automation) وجود روبوت؟",
            options: [
                "أ. نعم، لا أتمتة بدون روبوتات",
                "ب. لا، يمكن تشغيل الأتمتة بالـ PLCs والحساسات والسيور دون روبوتات"
            ],
            correct: 1,
            explanation: "الإجابة الصحيحة: (ب) الأتمتة تشمل خطوط الإنتاج والسيور والماكينات، والروبوت قد يكون جزءاً منها وليس شرطاً أساسياً."
        },
        {
            title: "السؤال الثالث: أي مكون مسؤول عن تحويل أوامر نظام التحكم إلى حركة ميكانيكية؟",
            options: [
                "أ. الحساس (Sensor)",
                "ب. الكاميرا الذكية (Camera)",
                "ج. المشغل (Actuator)",
                "د. شاشة العرض (Display)"
            ],
            correct: 2,
            explanation: "الإجابة الصحيحة: (ج) المشغلات (Actuators) مثل الموتورات والمكبس هي عضلات النظام التي تنفذ الحركة."
        },
        {
            title: "السؤال الرابع: كيف يساعد الذكاء الاصطناعي في مراقبة الجودة (Quality Control)؟",
            options: [
                "أ. عن طريق تحليل صور المنتجات واكتشاف العيوب بالرؤية الحاسوبية",
                "ب. عن طريق زيادة الوزن الإجمالي للماكينات",
                "ج. عن طريق إزالة جميع الحساسات من المصنع",
                "د. عن طريق تقليل سرعة خط الإنتاج للصفر"
            ],
            correct: 0,
            explanation: "الإجابة الصحيحة: (أ) الذكاء الاصطناعي يحلل صور الكاميرات للتعرف على العيوب وتصنيف المنتجات (Pass / Defective)."
        }
    ];

    // دالة عرض الشريحة المحددة
    function showSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });

        currentSlideIndex = index;
        counterText.innerText = `${String(index + 1).padStart(2, '0')} / ${totalSlides}`;
        
        const progressPercentage = ((index + 1) / totalSlides) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // تحديث محتوى الملاحظات للشريحة الحالية
        updateSpeakerNotes(index);
    }

    // التنقل للأمام
    function nextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            showSlide(currentSlideIndex + 1);
        }
    }

    // التنقل للخلف
    function prevSlide() {
        if (currentSlideIndex > 0) {
            showSlide(currentSlideIndex - 1);
        }
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // اختصارات لوحة المفاتيح الاحترافية
    document.addEventListener('keydown', (e) => {
        if (quizModal.classList.contains('active')) return; // عدم التداخل أثناء فتح الاختبار

        if (e.key === 'ArrowRight' || e.key === 'PageUp') {
            nextSlide(); // RTL اتجاه العرض العربي
        } else if (e.key === 'ArrowLeft' || e.key === 'PageDown') {
            prevSlide();
        } else if (e.key === 'f' || e.key === 'F') {
            toggleFullScreen();
        } else if (e.key === 'n' || e.key === 'N') {
            toggleNotesModal();
        } else if (e.key === 'Home') {
            showSlide(0);
        } else if (e.key === 'End') {
            showSlide(totalSlides - 1);
        }
    });

    // وضع ملء الشاشة (Fullscreen)
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error("Error attempting to enable fullscreen:", err);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullScreen);

    // إدارة ملاحظات المتحدث
    function updateSpeakerNotes(index) {
        const currentSlideEl = slides[index];
        const notesEl = currentSlideEl.querySelector('.speaker-notes');
        if (notesEl) {
            notesModalBody.innerHTML = `<p><strong>الشريحة رقم ${index + 1} (${currentSlideEl.dataset.duration || 'دقيقة'}):</strong></p><p style="margin-top:10px;">${notesEl.innerHTML}</p>`;
        } else {
            notesModalBody.innerHTML = "<p>لا توجد ملاحظات مخصصة لهذه الشريحة.</p>";
        }
    }

    function toggleNotesModal() {
        notesModal.classList.toggle('active');
    }

    notesToggleBtn.addEventListener('click', toggleNotesModal);
    closeNotesBtn.addEventListener('click', () => notesModal.classList.remove('active'));

    // محاكاة خط الإنتاج (Slide 5 Simulation)
    const runSimBtn = document.getElementById('runSimBtn');
    const simProduct = document.getElementById('simProduct');
    const simSensor = document.getElementById('simSensor');
    const simStatusText = document.getElementById('simStatusText');

    if (runSimBtn) {
        runSimBtn.addEventListener('click', () => {
            simProduct.style.left = '10px';
            simSensor.classList.remove('active');
            simStatusText.innerText = "جاري تحرك المنتج على السير...";
            
            setTimeout(() => {
                simProduct.style.left = 'calc(100% - 130px)';
            }, 100);

            setTimeout(() => {
                simSensor.classList.add('active');
                simStatusText.innerText = "تم اكتشاف المنتج بواسطة الحساس وأُرسلت الإشارة للـ PLC!";
            }, 1800);
        });
    }

    // محاكاة الفحص الذكي (Slide 7 AI Vision Scan)
    const scanBtn = document.getElementById('scanBtn');
    const aiResultBadge = document.getElementById('aiResultBadge');

    if (scanBtn) {
        scanBtn.addEventListener('click', () => {
            aiResultBadge.innerHTML = `<span class="status-indicator" style="color:#38bdf8;">جاري التحليل بالذكاء الاصطناعي...</span>`;
            setTimeout(() => {
                const isPass = Math.random() > 0.3;
                if (isPass) {
                    aiResultBadge.innerHTML = `<span class="status-indicator pass" style="background:rgba(16,185,129,0.15); color:#34d399; padding:6px 12px; border-radius:6px; border:1px solid #10b981;">PASS - المنتج سليم ومطابق</span>`;
                } else {
                    aiResultBadge.innerHTML = `<span class="status-indicator fail" style="background:rgba(239,68,68,0.15); color:#f87171; padding:6px 12px; border-radius:6px; border:1px solid #ef4444;">DEFECT DETECTED - عيوب ظاهرة!</span>`;
                }
            }, 1500);
        });
    }

    // محاكاة الحساسات (Slide 8 Sensor Distance Test)
    const moveBotBtn = document.getElementById('moveBotBtn');
    const movingBot = document.getElementById('movingBot');
    const distValue = document.getElementById('distValue');

    if (moveBotBtn) {
        moveBotBtn.addEventListener('click', () => {
            movingBot.style.left = '20px';
            distValue.innerText = "120";
            
            setTimeout(() => {
                movingBot.style.left = 'calc(100% - 110px)';
                distValue.innerText = "15";
            }, 100);

            setTimeout(() => {
                distValue.innerHTML = "15 سم (تم التوقف لتجنب الاصطدام!)";
            }, 1100);
        });
    }

    // نظام الاختبار التفاعلي (Q&A Quiz Modal)
    function loadQuestion(index) {
        const q = quizQuestions[index];
        qTitle.innerText = q.title;
        qOptions.innerHTML = '';
        qFeedback.style.display = 'none';
        qFeedback.innerText = q.explanation;

        q.options.forEach((optText, optIdx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.innerText = optText;
            btn.addEventListener('click', () => {
                // تلوين الاختيارات عند الضغط
                const allOpts = qOptions.querySelectorAll('.quiz-opt-btn');
                allOpts.forEach((b, bIdx) => {
                    if (bIdx === q.correct) {
                        b.classList.add('correct');
                    } else if (bIdx === optIdx) {
                        b.classList.add('incorrect');
                    }
                    b.disabled = true;
                });
                qFeedback.style.display = 'block';
            });
            qOptions.appendChild(btn);
        });
    }

    if (openQuizBtn) {
        openQuizBtn.addEventListener('click', () => {
            currentQuestionIndex = 0;
            loadQuestion(currentQuestionIndex);
            quizModal.classList.add('active');
        });
    }

    if (closeQuizBtn) {
        closeQuizBtn.addEventListener('click', () => quizModal.classList.remove('active'));
    }

    if (revealAnsBtn) {
        revealAnsBtn.addEventListener('click', () => {
            const q = quizQuestions[currentQuestionIndex];
            const allOpts = qOptions.querySelectorAll('.quiz-opt-btn');
            allOpts.forEach((b, bIdx) => {
                if (bIdx === q.correct) {
                    b.classList.add('correct');
                }
                b.disabled = true;
            });
            qFeedback.style.display = 'block';
        });
    }

    if (nextQBtn) {
        nextQBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizQuestions.length) {
                loadQuestion(currentQuestionIndex);
            } else {
                qTitle.innerText = "🎉 لقد انتهت الأسئلة بنجاح! شكراً لتفاعلكم الرائع.";
                qOptions.innerHTML = '';
                qFeedback.style.display = 'none';
                nextQBtn.style.display = 'none';
                revealAnsBtn.style.display = 'none';
            }
        });
    }

    // تشغيل الشريحة الأولى عند التحميل
    showSlide(0);
});