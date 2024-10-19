export function stakeFormat(stake) {
  if (stake === null) return "- -";
  if (stake < 10) return "K000+00" + stake;
  if (stake < 100) return "K000+0" + stake;
  if (stake < 1000) return "K000+" + stake;
  if (stake < 10000) {
    if (stake % 1000 < 10) return "K00" + parseInt(stake / 1000) + "+00" + (stake % 1000);
    if (stake % 1000 < 100) return "K00" + parseInt(stake / 1000) + "+0" + (stake % 1000);
    if (stake % 1000 < 1000) return "K00" + parseInt(stake / 1000) + "+" + (stake % 1000);
  }
  if (stake < 100000) {
    if (stake % 1000 < 10) return "K0" + parseInt(stake / 1000) + "+00" + (stake % 1000);
    if (stake % 1000 < 100) return "K0" + parseInt(stake / 1000) + "+0" + (stake % 1000);
    if (stake % 1000 < 1000) return "K0" + parseInt(stake / 1000) + "+" + (stake % 1000);
  }
  if (stake % 1000 < 10) return "K" + parseInt(stake / 1000) + "+00" + (stake % 1000);
  if (stake % 1000 < 100) return "K" + parseInt(stake / 1000) + "+0" + (stake % 1000);
  if (stake % 1000 < 1000) return "K" + parseInt(stake / 1000) + "+" + (stake % 1000);
}

export function genTree(data, label, value) {
  data.forEach(d => {
    d["label"] = d[label];
    d["value"] = d[value];
    d.children && d.children.length > 0 && genTree(d.children, label, value);
    Object.keys(d).forEach(k => {
      if (k != "label" && k != "value" && k != "children" && k!="key") {
        delete d[k];
      }
    });
  })
}

export function tsFormat(ts) {
  if (`${ts}`.length==10) ts*=1000;
  const formatterCN = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const time = formatterCN.format(new Date(ts));
  return time.replaceAll("/", "-")
}