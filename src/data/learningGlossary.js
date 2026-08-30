const GLOSSARY = Object.freeze([
  {
    term: "Hachem",
    aliases: ["Hachem"],
    definition: "La manière respectueuse de désigner Dieu dans la conversation."
  },
  {
    term: "Mitsva",
    aliases: ["Mitsva", "Mitsvot"],
    definition: "Un commandement de la Torah ; au pluriel, on dit Mitsvot."
  },
  {
    term: "Modé Ani",
    aliases: ["Modé Ani", "Modah Ani"],
    definition: "La courte phrase de remerciement récitée dès le réveil."
  },
  {
    term: "Nétilat Yadaïm",
    aliases: ["Nétilat Yadaïm", "Netilat Yadaïm"],
    definition: "Le lavage rituel des mains."
  },
  {
    term: "Chema",
    aliases: ["Chema"],
    definition: "Le passage de la Torah qui proclame l'unité de Dieu et qui doit être lu dans son temps."
  },
  {
    term: "Zrizout",
    aliases: ["Zrizout"],
    definition: "L'empressement réfléchi : se préparer et agir à temps, et non courir parce que l'on a tardé."
  },
  {
    term: "Cha'harit",
    aliases: ["Cha'harit", "Chaharit"],
    definition: "La prière du matin."
  },
  {
    term: "Min'ha",
    aliases: ["Min'ha", "Minha"],
    definition: "La prière de l'après-midi."
  },
  {
    term: "Arvit",
    aliases: ["Arvit"],
    definition: "La prière du soir."
  },
  {
    term: "Téfilines",
    aliases: ["Téfilines", "Téfiline", "Tefilines"],
    definition: "Les boîtiers contenant des passages de la Torah, portés au bras et sur la tête pendant la prière du matin."
  }
]);

export const getGlossaryForText = (value) => {
  const text = String(value || "").toLocaleLowerCase("fr");
  return GLOSSARY.filter((entry) => entry.aliases.some((alias) => (
    text.includes(alias.toLocaleLowerCase("fr"))
  )));
};
