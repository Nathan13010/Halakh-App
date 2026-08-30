const GLOSSARY = Object.freeze([
  {
    term: "Hachem",
    aliases: ["Hachem"],
    definition: "Hachem signifie littéralement « le Nom » en hébreu et sert à désigner respectueusement Dieu dans la vie courante sans prononcer ses noms sacrés.",
    emphasis: ["Hachem", "« le Nom »", "Dieu"]
  },
  {
    term: "Mitsva",
    aliases: ["Mitsva", "Mitsvot"],
    definition: "Une Mitsva est un commandement de la Torah ; au pluriel, on dit Mitsvot.",
    emphasis: ["Mitsva", "commandement de la Torah"]
  },
  {
    term: "Modé Ani",
    aliases: ["Modé Ani", "Modah Ani"],
    definition: "Modé Ani est la courte prière de remerciement récitée dès le réveil.",
    emphasis: ["Modé Ani", "prière de remerciement"]
  },
  {
    term: "Nétilat Yadaïm",
    aliases: ["Nétilat Yadaïm", "Netilat Yadaïm"],
    definition: "Nétilat Yadaïm désigne le lavage rituel des mains.",
    emphasis: ["Nétilat Yadaïm", "lavage rituel des mains"]
  },
  {
    term: "Chema",
    aliases: ["Chema"],
    definition: "Le Chema est un passage central de la Torah qui proclame l'unité de Dieu et doit être lu dans un horaire précis.",
    emphasis: ["Chema", "l'unité de Dieu"]
  },
  {
    term: "Zrizout",
    aliases: ["Zrizout"],
    definition: "La Zrizout est l'empressement réfléchi : se préparer et agir à temps, et non courir parce que l'on a tardé.",
    emphasis: ["Zrizout", "l'empressement réfléchi"]
  },
  {
    term: "Cha'harit",
    aliases: ["Cha'harit", "Chaharit"],
    definition: "Cha'harit est la prière du matin.",
    emphasis: ["Cha'harit", "prière du matin"]
  },
  {
    term: "Min'ha",
    aliases: ["Min'ha", "Minha"],
    definition: "Min'ha est la prière de l'après-midi.",
    emphasis: ["Min'ha", "prière de l'après-midi"]
  },
  {
    term: "Arvit",
    aliases: ["Arvit"],
    definition: "Arvit est la prière du soir.",
    emphasis: ["Arvit", "prière du soir"]
  },
  {
    term: "Téfilines",
    aliases: ["Téfilines", "Téfiline", "Tefilines"],
    definition: "Les Téfilines sont des boîtiers contenant des passages de la Torah, portés au bras et sur la tête pendant la prière du matin.",
    emphasis: ["Téfilines", "passages de la Torah"]
  }
]);

export const getGlossaryForText = (value) => {
  const text = String(value || "").toLocaleLowerCase("fr");
  return GLOSSARY.filter((entry) => entry.aliases.some((alias) => (
    text.includes(alias.toLocaleLowerCase("fr"))
  )));
};
