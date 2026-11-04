import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const header = document.querySelector<HTMLElement>('[data-site-header]');

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const mobileMenu = document.querySelector<HTMLDialogElement>('[data-mobile-menu]');
const menuOpenButton = document.querySelector<HTMLButtonElement>('[data-menu-open]');

if (mobileMenu && menuOpenButton) {
  const items = mobileMenu.querySelectorAll<HTMLElement>('[data-menu-item]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let closing = false;

  const openMenu = () => {
    if (mobileMenu.open) return;
    // ponytail: native modal dialog = top layer, background inert, focus kept inside
    mobileMenu.showModal();
    document.documentElement.classList.add('menu-open');
    menuOpenButton.setAttribute('aria-expanded', 'true');
    gsap.killTweensOf([mobileMenu, items]);
    if (reducedMotion.matches) {
      gsap.set([mobileMenu, items], { clearProps: 'all' });
      return;
    }
    gsap.timeline()
      .fromTo(mobileMenu, { opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.5, ease: 'power3.out' })
      .fromTo(items, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.045, ease: 'power2.out', clearProps: 'opacity,transform' }, '-=0.28');
  };

  const closeMenu = (afterClose?: () => void) => {
    if (!mobileMenu.open || closing) return;
    closing = true;
    const finish = () => {
      mobileMenu.close();
      gsap.set(mobileMenu, { clearProps: 'all' });
      document.documentElement.classList.remove('menu-open');
      menuOpenButton.setAttribute('aria-expanded', 'false');
      menuOpenButton.focus({ preventScroll: true });
      closing = false;
      afterClose?.();
    };
    gsap.killTweensOf([mobileMenu, items]);
    if (reducedMotion.matches) return finish();
    gsap.to(mobileMenu, { opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 0.38, ease: 'power3.in', onComplete: finish });
  };

  menuOpenButton.addEventListener('click', openMenu);
  mobileMenu.querySelector('[data-menu-close]')?.addEventListener('click', () => closeMenu());

  // Opacity only: hiding with visibility would drop focus from the dialog.
  // Escape fires "cancel"; intercept it so the close animation runs.
  mobileMenu.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeMenu();
  });

  mobileMenu.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const hash = link.hash;
      closeMenu(() => {
        document.querySelector(hash)?.scrollIntoView();
        history.pushState(null, '', hash);
      });
    });
  });

  window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}

// Card flare follows the pointer (mouse/pen only); touch keeps the static corner flare.
if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('pointermove', (event) => {
    const card = (event.target as Element).closest<HTMLElement>('.surface-card, .flare');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }, { passive: true });
}

const motion = gsap.matchMedia();

motion.add('(prefers-reduced-motion: no-preference)', () => {
  const context = gsap.context(() => {
    gsap.from('[data-hero-item]', {
      autoAlpha: 0,
      y: 14,
      duration: 0.65,
      stagger: 0.07,
      ease: 'power2.out',
      clearProps: 'opacity,visibility,transform',
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      gsap.from(element, {
        autoAlpha: 0,
        y: 16,
        duration: 0.55,
        ease: 'power2.out',
        clearProps: 'opacity,visibility,transform',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          once: true,
        },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
      const children = Array.from(group.children);
      if (!children.length) return;

      gsap.from(children, {
        autoAlpha: 0,
        y: 14,
        duration: 0.5,
        stagger: children.length > 8 ? 0.035 : 0.065,
        ease: 'power2.out',
        clearProps: 'opacity,visibility,transform',
        scrollTrigger: {
          trigger: group,
          start: 'top 88%',
          once: true,
        },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-project-media]').forEach((media) => {
      gsap.from(media, {
        autoAlpha: 0,
        scale: 0.975,
        duration: 0.65,
        ease: 'power2.out',
        clearProps: 'opacity,visibility,transform',
        scrollTrigger: {
          trigger: media,
          start: 'top 90%',
          once: true,
        },
      });
    });
  });

  return () => context.revert();
});

motion.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
  const context = gsap.context(() => {
    const heroGlow = document.querySelector<HTMLElement>('[data-parallax]');
    const aboutImage = document.querySelector<HTMLElement>('[data-about-image]');

    if (heroGlow) {
      gsap.to(heroGlow, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-hero]',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }

    if (aboutImage) {
      gsap.fromTo(
        aboutImage,
        { yPercent: -2 },
        {
          yPercent: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: aboutImage,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        },
      );
    }
  });

  return () => context.revert();
});

// Capability micro-interfaces: markup is the finished static state; these loops play only while visible.
motion.add('(prefers-reduced-motion: no-preference)', () => {
  const timelines: gsap.core.Timeline[] = [];
  const texts: [Element, string | null][] = [];
  const cleanups: (() => void)[] = [];
  const q = <T extends Element = HTMLElement>(root: Element, selector: string) => root.querySelector<T>(selector)!;
  const qa = (root: Element, selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));

  const loop = (scene: HTMLElement, build: (tl: gsap.core.Timeline) => void) => {
    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.5 });
    build(tl);
    timelines.push(tl);
    ScrollTrigger.create({
      trigger: scene,
      start: 'top bottom-=40',
      end: 'bottom top+=40',
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
    });
  };

  const counter = (el: Element, from: number, to: number, format: (v: number) => string, duration: number) => {
    texts.push([el, el.textContent]);
    const proxy = { v: from };
    return gsap.fromTo(proxy, { v: from }, { v: to, duration, ease: 'power1.inOut', onUpdate: () => { el.textContent = format(proxy.v); } });
  };

  const context = gsap.context(() => {
    const design = document.querySelector<HTMLElement>('[data-scene="design"]');
    if (design) {
      const cursor = q(design, '[data-d-cursor]');
      const button = q(design, '[data-d-button]');
      const knob = q(design, '[data-d-knob]');
      // Cursor targets are measured, so they stay correct at any card width.
      const at = (el: Element, fx: number, fy: number) => ({
        x: () => el.getBoundingClientRect().left - design.getBoundingClientRect().left + el.getBoundingClientRect().width * fx,
        y: () => el.getBoundingClientRect().top - design.getBoundingClientRect().top + el.getBoundingClientRect().height * fy,
      });
      const click = { scale: 0.82, duration: 0.1, yoyo: true, repeat: 1 };

      loop(design, (tl) => {
        tl.set(cursor, { left: 0, top: 0, autoAlpha: 0, ...at(q(design, '[data-d-frame]'), 0.75, 0.3) })
          .set(button, { backgroundColor: 'rgba(0,255,151,0)', borderColor: 'rgba(255,255,255,0.28)', color: '#f7f8fb', borderRadius: 4 })
          .set(qa(design, '[data-d-select], [data-d-size], [data-d-ring]'), { autoAlpha: 0 })
          .set(q(design, '[data-d-radius]'), { width: '20%' })
          .set(knob, { left: '20%' })
          .fromTo(q(design, '[data-d-frame]'), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' })
          .fromTo(q(design, '[data-d-media]'), { opacity: 0.2 }, { opacity: 1, duration: 0.5 }, '<0.15')
          .fromTo(qa(design, '[data-d-line]'), { scaleX: 0 }, { scaleX: 1, duration: 0.4, stagger: 0.15, ease: 'power2.out' }, '<0.1')
          .to(cursor, { autoAlpha: 1, duration: 0.25 })
          .to(cursor, { ...at(button, 0.7, 0.65), duration: 0.75, ease: 'power2.inOut' })
          .to(cursor, click)
          .fromTo(q(design, '[data-d-select]'), { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.25 }, '<')
          .fromTo(q(design, '[data-d-size]'), { autoAlpha: 0, x: -4 }, { autoAlpha: 1, x: 0, duration: 0.25 }, '<0.1')
          .to(cursor, { ...at(q(design, '[data-d-swatch]'), 0.6, 0.6), duration: 0.7, ease: 'power2.inOut' }, '+=0.25')
          .to(cursor, click)
          .to(q(design, '[data-d-ring]'), { autoAlpha: 1, duration: 0.2 }, '<')
          .to(button, { backgroundColor: 'rgba(0,255,151,1)', borderColor: 'rgba(0,255,151,1)', color: '#00020f', duration: 0.35 }, '<0.05')
          .to(cursor, { ...at(knob, 0.5, 0.6), duration: 0.6, ease: 'power2.inOut' }, '+=0.2')
          .addLabel('drag')
          .to(knob, { left: '80%', duration: 0.7, ease: 'power1.inOut' }, 'drag')
          .to(q(design, '[data-d-radius]'), { width: '80%', duration: 0.7, ease: 'power1.inOut' }, 'drag')
          .to(cursor, { ...at(knob.parentElement!, 0.8, 0.6), duration: 0.7, ease: 'power1.inOut' }, 'drag')
          .to(button, { borderRadius: 14, duration: 0.7, ease: 'power1.inOut' }, 'drag')
          .add(counter(q(design, '[data-d-radius-value]'), 4, 14, (v) => String(Math.round(v)), 0.7), 'drag')
          .to(cursor, { autoAlpha: 0, duration: 0.3 }, '+=0.4')
          .to(q(design, '[data-d-frame]'), { autoAlpha: 0, duration: 0.4 }, '+=1.1');
      });

      const refresh = () => timelines[0]?.invalidate();
      window.addEventListener('resize', refresh);
      cleanups.push(() => window.removeEventListener('resize', refresh));
    }

    const dev = document.querySelector<HTMLElement>('[data-scene="dev"]');
    if (dev) {
      const code = q(dev, '[data-v-code]');
      const preview = q(dev, '[data-v-preview]');
      const building = q(dev, '[data-v-state="build"]');
      const done = q(dev, '[data-v-state="done"]');

      loop(dev, (tl) => {
        tl.set([building, done], { opacity: 0 })
          .set(q(dev, '[data-v-progress]'), { scaleX: 0 })
          .set(preview, { autoAlpha: 0, y: 8 })
          .fromTo(code, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
          .fromTo(qa(dev, '[data-v-line]'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.4, stagger: 0.4, ease: 'steps(16)' })
          .fromTo(q(dev, '[data-v-caret]'), { opacity: 1 }, { opacity: 0, duration: 0.2, repeat: 3, yoyo: true })
          .addLabel('build')
          .to(building, { opacity: 1, duration: 0.2 }, 'build')
          .to(q(dev, '[data-v-progress]'), { scaleX: 1, duration: 1.3, ease: 'power1.inOut' }, 'build')
          .fromTo(q(dev, '[data-v-spinner]'), { rotation: 0 }, { rotation: 720, transformOrigin: '50% 50%', duration: 1.3, ease: 'none' }, 'build')
          .add(counter(q(dev, '[data-v-time]'), 0, 0.84, (v) => `${v.toFixed(2)}s`, 1.3), 'build')
          .to(building, { opacity: 0, duration: 0.15 })
          .to(done, { opacity: 1, duration: 0.2 })
          .to(preview, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' }, '<')
          .to([code, preview], { autoAlpha: 0, duration: 0.4 }, '+=1.4');
      });
    }

    const ai = document.querySelector<HTMLElement>('[data-scene="ai"]');
    if (ai) {
      const nodes = qa(ai, '[data-a-node]');
      const links = qa(ai, '[data-a-link]');
      const state = (tl: gsap.core.Timeline, node: HTMLElement, name: string, position: gsap.Position) =>
        tl.set(qa(node, '[data-a-state]'), { opacity: 0 }, position).set(q(node, `[data-a-state="${name}"]`), { opacity: 1 }, '<');

      loop(ai, (tl) => {
        tl.set(links, { scaleX: 0, scaleY: 0, opacity: 1 })
          .set(q(ai, '[data-a-head="done"]'), { opacity: 0 })
          .set(q(ai, '[data-a-head="run"]'), { opacity: 1 });
        nodes.forEach((node) => state(tl, node, 'idle', 0));
        tl.fromTo(nodes, { opacity: 0.55 }, { opacity: 1, duration: 0.35 });

        nodes.forEach((node, index) => {
          state(tl, node, 'run', '+=0.15');
          tl.to(node, { borderColor: 'rgba(0,255,151,0.45)', duration: 0.2 }, '<')
            .fromTo(q(node, '[data-a-pulse]'), { boxShadow: '0 0 0 0 rgba(0,255,151,0.35)' }, { boxShadow: '0 0 0 4px rgba(0,255,151,0)', duration: 0.6 });
          state(tl, node, 'done', '+=0.05');
          tl.to(node, { borderColor: 'rgba(255,255,255,0.1)', duration: 0.3 }, '<');
          if (links[index]) tl.to(links[index], { [index === 1 ? 'scaleY' : 'scaleX']: 1, duration: 0.45, ease: 'power2.inOut' }, '<');
        });

        tl.set(q(ai, '[data-a-head="run"]'), { opacity: 0 })
          .set(q(ai, '[data-a-head="done"]'), { opacity: 1 }, '<')
          .to(links, { opacity: 0, duration: 0.4 }, '+=1.6')
          .to(nodes, { opacity: 0.55, duration: 0.4 }, '<');
      });
    }
  });

  return () => {
    context.revert();
    cleanups.forEach((fn) => fn());
    texts.forEach(([el, text]) => { el.textContent = text; });
  };
});
