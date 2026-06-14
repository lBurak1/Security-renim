// Tüm domain ve modül JSON'larını derleme zamanında toplar.
import domains from '../data/domains.json'

// Vite: src/data altındaki tüm modül json'larını topla
const moduleFiles = import.meta.glob('../data/domain-*/*.json', { eager: true })

const modulesByFile = {}
for (const path in moduleFiles) {
  // path: ../data/domain-1/1.1-security-controls.json
  const rel = path.replace('../data/', '')
  modulesByFile[rel] = moduleFiles[path].default
}

export function getDomains() {
  return domains.domains
}

export function getModule(fileRef) {
  return modulesByFile[fileRef] || null
}

export function getModuleById(moduleId) {
  for (const d of domains.domains) {
    const m = d.modules.find((x) => x.id === moduleId)
    if (m) return { meta: m, data: getModule(m.file), domain: d }
  }
  return null
}

export function getAllQuestions() {
  const out = []
  for (const d of domains.domains) {
    for (const m of d.modules) {
      const data = getModule(m.file)
      if (data?.questions) {
        data.questions.forEach((q) => out.push({ ...q, moduleId: m.id, domainId: d.id }))
      }
    }
  }
  return out
}

export function getAllGlossary() {
  const out = []
  for (const d of domains.domains) {
    for (const m of d.modules) {
      const data = getModule(m.file)
      if (data?.glossary) {
        data.glossary.forEach((g) => out.push({ ...g, moduleId: m.id, domainId: d.id }))
      }
    }
  }
  return out
}
