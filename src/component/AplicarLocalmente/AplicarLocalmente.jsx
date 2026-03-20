import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AplicarLocalmente.module.css";
import FixedHeader from "../FixedHeader";

const BENEFITS = [
  {
    icon: "💰",
    title: "Gana dinero flexible",
    text: "Establece tu propia tarifa por hora y trabaja las horas que desees. Tú controlas tu horario — trabaja a tiempo completo o parcial según tu disponibilidad.",
  },
  {
    icon: "📱",
    title: "Reservas a través de la app",
    text: "Recibe solicitudes de reserva directamente en tu teléfono. Acepta, rechaza o administra tus trabajos con un solo toque — sin llamadas ni papeleo.",
  },
  {
    icon: "🏠",
    title: "Trabaja cerca de ti",
    text: "Conectamos a los clientes con maids en su área local. Trabajarás en hogares cercanos a ti — menos tiempo de viaje, más tiempo productivo.",
  },
  {
    icon: "🛡️",
    title: "Pagos seguros y garantizados",
    text: "Los pagos se procesan a través de Paystack antes de que llegues al trabajo. Nunca perseguirás un pago — el dinero llega a tu cuenta puntualmente.",
  },
  {
    icon: "⭐",
    title: "Construye tu reputación",
    text: "Cada trabajo bien hecho genera reseñas de cinco estrellas. Una sólida reputación significa más reservas, mejores clientes y mayores ingresos con el tiempo.",
  },
  {
    icon: "🎓",
    title: "Entrenamiento y apoyo",
    text: "Recibirás acceso a nuestros estándares de limpieza y guías de calidad. Nuestro equipo de soporte está disponible si alguna vez necesitas ayuda.",
  },
];

const STEPS = [
  {
    title: "Completa tu solicitud",
    text: "Llena el formulario a continuación con tus datos personales, ubicación y experiencia. Solo toma unos minutos.",
  },
  {
    title: "Revisión y verificación",
    text: "Nuestro equipo revisa tu solicitud y realiza una verificación de antecedentes básica. Normalmente respondemos en 48 horas.",
  },
  {
    title: "Configura tu perfil",
    text: "Una vez aprobado, configura tu perfil con tu foto, servicios ofrecidos, tarifa por hora y disponibilidad.",
  },
  {
    title: "Recibe tu primera reserva",
    text: "Los clientes de tu área comenzarán a encontrar tu perfil. Acepta tu primera reserva y comienza a ganar.",
  },
];

const FAQS = [
  {
    q: "¿Necesito experiencia previa en limpieza?",
    a: "La experiencia es una ventaja pero no es obligatoria. Lo más importante es tu compromiso con la calidad, la puntualidad y la atención al detalle. Proporcionamos guías y estándares de limpieza para todos los nuevos miembros.",
  },
  {
    q: "¿Cuánto puedo ganar?",
    a: "Los ingresos dependen de tu tarifa por hora, la cantidad de horas que trabajes y tu calificación de reseñas. Las maids activas en Abuja y Lagos ganan entre ₦30,000 y ₦120,000 al mes trabajando de forma regular.",
  },
  {
    q: "¿Necesito traer mis propios suministros de limpieza?",
    a: "La mayoría de los clientes proporcionan los suministros de limpieza o los acuerdas de antemano. Si traes tus propios productos, puedes cobrar una tarifa adicional — esto queda a tu discreción.",
  },
  {
    q: "¿Cómo funciona el pago?",
    a: "Los clientes pagan en línea antes del servicio a través de Paystack. Una vez completado el trabajo, el pago se libera directamente a tu cuenta bancaria registrada.",
  },
  {
    q: "¿Puedo rechazar reservas que no me convengan?",
    a: "Sí. Tienes total control sobre las reservas que aceptas. Puedes revisar los detalles del trabajo — ubicación, duración, tipo de limpieza — antes de confirmar.",
  },
  {
    q: "¿En qué ciudades operan actualmente?",
    a: "Actualmente operamos en Abuja y Lagos, con planes de expansión a otras ciudades nigerianas en el futuro próximo. Si no estás en ninguna de estas ciudades, igual puedes aplicar y te notificaremos cuando lleguemos a tu área.",
  },
];

const REQUIREMENTS = [
  "Ser mayor de 18 años",
  "Tener un teléfono inteligente con acceso a internet",
  "Contar con identificación oficial válida",
  "Residir en Abuja o Lagos",
  "Capacidad para comunicarse con los clientes",
  "Compromiso con los estándares de calidad de Deusizi Sparkle",
];

const SERVICES = [
  "Limpieza general del hogar",
  "Limpieza profunda",
  "Limpieza de cocina",
  "Limpieza de baños",
  "Lavandería y planchado",
  "Organización del hogar",
  "Limpieza de ventanas",
  "Limpieza de alfombras",
];

export default function AplicarLocalmente() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    experience: "",
    services: [],
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function toggleService(s) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter((x) => x !== s)
        : [...prev.services, s],
    }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Por favor ingresa tu nombre";
    if (!form.email.trim()) e.email = "Por favor ingresa tu correo";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Correo electrónico inválido";
    if (!form.phone.trim()) e.phone = "Por favor ingresa tu número de teléfono";
    if (!form.city) e.city = "Por favor selecciona tu ciudad";
    if (!form.message.trim()) e.message = "Por favor cuéntanos sobre ti";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
  }

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Aplicar localmente</p>
        <h1 className={styles.heroTitle}>
          Trabaja como maid con
          <br />
          <em>Deusizi Sparkle.</em>
        </h1>
        <p className={styles.heroDesc}>
          Únete a nuestra red de profesionales de limpieza en Abuja y Lagos.
          Establece tu propio horario, fija tu tarifa y gana dinero haciendo lo
          que sabes hacer bien.
        </p>
        <div className={styles.heroDivider} />
        <div className={styles.heroButtons}>
          <button
            className={styles.heroPrimary}
            onClick={() =>
              document
                .getElementById("apply")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Aplicar ahora
          </button>
          <button
            className={styles.heroSecondary}
            onClick={() =>
              document
                .getElementById("como-funciona")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Cómo funciona
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        {[
          ["50+", "Maids activas"],
          ["₦80k", "Promedio mensual"],
          ["2", "Ciudades activas"],
          ["5★", "Calificación media"],
        ].map(([n, l]) => (
          <div key={l} className={styles.statItem}>
            <p className={styles.statNum}>{n}</p>
            <p className={styles.statLabel}>{l}</p>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Por qué unirte</p>
        <h2 className={styles.sectionTitle}>
          Todo lo que necesitas para empezar a ganar
        </h2>
        <div className={styles.benefitCards}>
          {BENEFITS.map((b) => (
            <div key={b.title} className={styles.benefitCard}>
              <div className={styles.benefitIcon}>{b.icon}</div>
              <div>
                <p className={styles.benefitTitle}>{b.title}</p>
                <p className={styles.benefitText}>{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className={styles.requirements}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Requisitos
        </p>
        <h2 className={styles.requirementsTitle}>
          ¿Qué necesitas para aplicar?
        </h2>
        <p className={styles.requirementsSub}>
          Buscamos personas comprometidas, puntuales y con ganas de trabajar.
        </p>
        <div className={styles.requirementGrid}>
          {REQUIREMENTS.map((r) => (
            <div key={r} className={styles.requirementItem}>
              <div className={styles.requirementCheck}>✓</div>
              <span className={styles.requirementText}>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className={styles.process} id="como-funciona">
        <p className={styles.sectionEyebrow}>El proceso</p>
        <h2 className={styles.sectionTitle}>
          De la solicitud a tu primer trabajo
        </h2>
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={s.title} className={styles.step}>
              <div className={styles.stepNum}>{i + 1}</div>
              <div className={styles.stepBody}>
                <p className={styles.stepTitle}>{s.title}</p>
                <p className={styles.stepText}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application form */}
      <div className={styles.formSection} id="apply">
        <div className={styles.formInner}>
          <p className={styles.sectionEyebrow}>Tu solicitud</p>
          <h2 className={styles.sectionTitle}>
            Aplica para unirte a nuestro equipo
          </h2>

          {submitted ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✅</div>
              <h3 className={styles.successTitle}>¡Solicitud enviada!</h3>
              <p className={styles.successText}>
                Gracias por tu interés. Nuestro equipo revisará tu solicitud y
                se pondrá en contacto contigo en un plazo de 48 horas.
              </p>
              <button
                className={styles.heroPrimary}
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: "",
                    email: "",
                    phone: "",
                    city: "",
                    experience: "",
                    services: [],
                    message: "",
                  });
                }}
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Nombre completo <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="ej. María García"
                  />
                  {errors.name && <p className={styles.error}>{errors.name}</p>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Correo electrónico <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ej. maria@correo.com"
                  />
                  {errors.email && (
                    <p className={styles.error}>{errors.email}</p>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Teléfono <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="ej. 0803 0588 774"
                  />
                  {errors.phone && (
                    <p className={styles.error}>{errors.phone}</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Ciudad <span className={styles.req}>*</span>
                  </label>
                  <select
                    className={`${styles.input} ${styles.select} ${errors.city ? styles.inputError : ""}`}
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona tu ciudad…</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Lagos">Lagos</option>
                  </select>
                  {errors.city && <p className={styles.error}>{errors.city}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Años de experiencia{" "}
                  <span className={styles.optional}>(opcional)</span>
                </label>
                <select
                  className={`${styles.input} ${styles.select}`}
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una opción…</option>
                  <option value="0">Sin experiencia previa</option>
                  <option value="1">Menos de 1 año</option>
                  <option value="2">1 – 2 años</option>
                  <option value="3">3 – 5 años</option>
                  <option value="5+">Más de 5 años</option>
                </select>
              </div>

              {/* Services offered */}
              <div className={styles.field}>
                <label className={styles.label}>
                  Servicios que puedes ofrecer{" "}
                  <span className={styles.optional}>(opcional)</span>
                </label>
                <div className={styles.serviceGrid}>
                  {SERVICES.map((s) => {
                    const selected = form.services.includes(s);
                    return (
                      <div
                        key={s}
                        className={`${styles.serviceItem} ${selected ? styles.serviceItemActive : ""}`}
                        onClick={() => toggleService(s)}
                      >
                        <div
                          className={`${styles.serviceCheck} ${selected ? styles.serviceCheckActive : ""}`}
                        >
                          {selected && "✓"}
                        </div>
                        <span>{s}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Cuéntanos sobre ti <span className={styles.req}>*</span>
                </label>
                <textarea
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tu experiencia, motivación y disponibilidad horaria…"
                  rows={5}
                />
                {errors.message && (
                  <p className={styles.error}>{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={sending}
              >
                {sending ? (
                  <span className={styles.spinnerRow}>
                    <span className={styles.spinner} /> Enviando…
                  </span>
                ) : (
                  "Enviar solicitud"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Preguntas frecuentes</p>
        <h2 className={styles.sectionTitle}>Todo lo que necesitas saber</h2>
        <div className={styles.faqList}>
          {FAQS.map((f, i) => (
            <div key={i} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {f.q}
                <span
                  className={`${styles.faqChevron} ${openFaq === i ? styles.faqChevronOpen : ""}`}
                >
                  ▾
                </span>
              </button>
              {openFaq === i && <p className={styles.faqAnswer}>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>¿Lista para empezar a ganar?</h2>
        <p className={styles.ctaText}>
          Únete a nuestra red de profesionales y recibe tu primera reserva esta
          semana.
        </p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.ctaPrimary}
            onClick={() =>
              document
                .getElementById("apply")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Aplicar ahora
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={() => navigate("/contact")}
          >
            Contactar al equipo
          </button>
        </div>
      </div>
    </div>
  );
}
