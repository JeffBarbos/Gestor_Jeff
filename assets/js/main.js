/**
 * Jeferson Barbosa - Gestor de Tráfego Pago
 * Scripts de Interatividade: Menu Mobile Drawer, Header Scroll & Lead Form
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header scroll effect
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. Mobile Menu Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileDrawerLinks = document.querySelectorAll('.mobile-drawer-link');

    const openDrawer = () => {
        mobileDrawer?.classList.add('active');
        mobileNavOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        mobileDrawer?.classList.remove('active');
        mobileNavOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openDrawer);
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', closeDrawer);
    }

    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeDrawer);
    }

    mobileDrawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });

    // 3. Smooth scroll handling for internal anchor links with close drawer
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 4. Máscara amigável para telefone (00) 00000-0000 ou (00) 0000-0000
    const telefoneInput = document.getElementById('leadTelefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 10) {
                // Formato celular: (XX) XXXXX-XXXX
                e.target.value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            } else if (value.length > 5) {
                // Formato intermediário ou fixo
                e.target.value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
            } else if (value.length > 2) {
                e.target.value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
            } else {
                e.target.value = value;
            }
        });
    }

    // 5. Tratamento e Submissão do Formulário de Diagnóstico
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('leadNome')?.value.trim();
            const telefone = document.getElementById('leadTelefone')?.value.trim();
            const empresa = document.getElementById('leadEmpresa')?.value.trim();
            const segmento = document.getElementById('leadSegmento')?.value.trim();
            const cidade = document.getElementById('leadCidade')?.value.trim();
            const faturamento = document.getElementById('leadFaturamento')?.value;

            const leadData = {
                nome,
                telefone,
                empresa,
                segmento,
                cidade,
                faturamento,
                submittedAt: new Date().toISOString()
            };

            // Salva os dados para serem usados na página de obrigado
            try {
                sessionStorage.setItem('lead_data', JSON.stringify(leadData));
            } catch (err) {
                console.warn('Não foi possível armazenar lead_data em sessionStorage', err);
            }

            // Dispara evento no dataLayer para Google Tag Manager
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'lead_form_submitted',
                lead_empresa: empresa,
                lead_segmento: segmento,
                lead_faturamento: faturamento
            });

            // Redireciona para a página de agradecimento
            window.location.href = 'obrigado.html';
        });
    }

    // 6. Rastreamento e DataLayer para cliques nos botões de WhatsApp (<button data-href>)
    //    Usa delegação de evento no document para capturar qualquer .btn-whatsapp,
    //    incluindo os do obrigado.html que carregam data-href dinamicamente.
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-whatsapp');
        if (!btn) return;

        const waUrl = btn.getAttribute('data-href') || '';
        const location = btn.getAttribute('data-location') || 'geral';

        // Push ao dataLayer ANTES de abrir a janela para garantir captura pelo GTM
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'whatsapp_click',
            click_url: waUrl,
            click_id: btn.id || '',
            click_class: btn.className || '',
            click_text: btn.innerText ? btn.innerText.trim() : '',
            click_location: location
        });

        // Abre o WhatsApp em nova aba
        if (waUrl) {
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        }
    });
});
