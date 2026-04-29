"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type ContactFormProps = {
  /** Vorauswahl z. B. auf /hundepension oder /katzenbetreuung */
  defaultService?: string
  /** Eindeutige Präfixe für IDs (Modal vs. Seite) */
  idPrefix?: string
  /** Ohne äußere Card — z. B. wenn der Dialog schon einen Rahmen hat */
  bare?: boolean
  /** Im Modal: dichtere Abstände, gleiche Felder wie auf der Seite */
  variant?: "page" | "modal"
}

const emptyForm = {
  name: "",
  vorname: "",
  email: "",
  phone: "",
  pet: "",
  service: "",
  message: "",
  availability: "",
  privacy: false,
  anzahlTiere: "",
  tiernamen: "",
  schulferienBW: false,
  konkreterUrlaub: "",
  urlaubVon: "",
  urlaubBis: "",
  intaktKastriert: "",
  alter: "",
}

export function ContactForm({
  defaultService = "",
  idPrefix = "",
  bare = false,
  variant = "page",
}: ContactFormProps) {
  const m = variant === "modal"
  const [formData, setFormData] = useState(() => ({
    ...emptyForm,
    service: defaultService,
  }))

  const parseDateFromInput = (dateString: string): Date | undefined => {
    if (!dateString) return undefined
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? undefined : date
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({
    type: null,
    message: "",
  })

  const vonInputId = `${idPrefix}urlaubVon-input`
  const bisInputId = `${idPrefix}urlaubBis-input`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    if (formData.service === "hundepension" && formData.konkreterUrlaub === "ja") {
      if (!formData.urlaubVon || !formData.urlaubBis) {
        setSubmitStatus({
          type: "error",
          message: "Bitte wählen Sie einen Urlaubszeitraum aus.",
        })
        setIsSubmitting(false)
        return
      }

      const vonDate = parseDateFromInput(formData.urlaubVon)
      const bisDate = parseDateFromInput(formData.urlaubBis)

      if (!vonDate || !bisDate) {
        setSubmitStatus({
          type: "error",
          message: "Bitte wählen Sie gültige Daten aus.",
        })
        setIsSubmitting(false)
        return
      }

      if (bisDate < vonDate) {
        setSubmitStatus({
          type: "error",
          message: "Das Enddatum muss nach dem Startdatum liegen.",
        })
        setIsSubmitting(false)
        return
      }
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          urlaubVon: formData.urlaubVon
            ? parseDateFromInput(formData.urlaubVon)?.toISOString()
            : undefined,
          urlaubBis: formData.urlaubBis
            ? parseDateFromInput(formData.urlaubBis)?.toISOString()
            : undefined,
          timestamp: new Date().toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Senden der Anfrage")
      }

      setSubmitStatus({
        type: "success",
        message:
          "Ihre Anfrage wurde erfolgreich gesendet! Wir melden uns schnellstmöglich bei Ihnen.",
      })

      setFormData({
        ...emptyForm,
        service: defaultService,
      })
    } catch (error) {
      console.error("Fehler beim Senden:", error)
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const labelCls = m
    ? "block text-xs font-medium text-sage-900 mb-1"
    : "block text-sm font-medium text-sage-900 mb-2"
  const inputCls = cn(
    "border-sage-300 focus:border-sage-500",
    m && "h-9 text-sm"
  )
  const grid2 = cn("grid md:grid-cols-2", m ? "gap-3" : "gap-4")
  const selectCls = cn(
    "w-full rounded-md border border-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500",
    m ? "h-9 px-2.5 py-1 text-sm" : "px-3 py-2"
  )

  const formInner = (
    <form
      onSubmit={handleSubmit}
      className={cn(m ? "space-y-4" : "space-y-6")}
    >
      <div className={grid2}>
        <div>
          <label className={labelCls}>Name *</label>
          <Input
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Vorname *</label>
          <Input
            required
            value={formData.vorname}
            onChange={(e) =>
              setFormData({ ...formData, vorname: e.target.value })
            }
            className={inputCls}
          />
        </div>
      </div>

      <div className={grid2}>
        <div>
          <label className={labelCls}>E-Mail Adresse *</label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Telefonnummer *</label>
          <Input
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Gewünschte Leistung</label>
        <select
          required={m}
          value={formData.service}
          onChange={(e) =>
            setFormData({ ...formData, service: e.target.value })
          }
          className={selectCls}
        >
          <option value="">Bitte wählen</option>
          <option value="hundepension">Hundepension</option>
          <option value="katzenbetreuung">Mobile Katzenbetreuung</option>
          <option value="tagesbetreuung">Tagesbetreuung</option>
          <option value="notfall">Notfallbetreuung</option>
        </select>
      </div>

      {formData.service === "hundepension" && (
        <div
          className={cn(
            "bg-sage-100 rounded-lg border border-sage-300",
            m ? "space-y-3 p-3.5 sm:p-4" : "space-y-6 p-6"
          )}
        >
          <h3
            className={cn(
              "font-raleway font-bold text-sage-900",
              m ? "text-sm sm:text-base mb-1" : "text-lg mb-4"
            )}
          >
            Zusätzliche Informationen für die Hundepension
          </h3>

          <div className={grid2}>
            <div>
              <label className={labelCls}>Anzahl der Tiere *</label>
              <Input
                type="number"
                min={1}
                required
                value={formData.anzahlTiere}
                onChange={(e) =>
                  setFormData({ ...formData, anzahlTiere: e.target.value })
                }
                className={inputCls}
                placeholder="z.B. 1, 2, 3"
              />
            </div>
            <div>
              <label className={labelCls}>Tiername/n *</label>
              <Input
                required
                value={formData.tiernamen}
                onChange={(e) =>
                  setFormData({ ...formData, tiernamen: e.target.value })
                }
                className={inputCls}
                placeholder="z.B. Luna, Max, Bella"
              />
            </div>
          </div>

          <div className={grid2}>
            <div>
              <label className={labelCls}>Alter *</label>
              <Input
                type="number"
                min={0}
                required
                value={formData.alter}
                onChange={(e) =>
                  setFormData({ ...formData, alter: e.target.value })
                }
                className={inputCls}
                placeholder="Alter in Jahren"
              />
            </div>
            <div>
              <label className={labelCls}>Intakt/Kastriert *</label>
              <Select
                value={formData.intaktKastriert}
                onValueChange={(value) =>
                  setFormData({ ...formData, intaktKastriert: value })
                }
                required
              >
                <SelectTrigger
                  className={cn(
                    "border-sage-300 focus:border-sage-500",
                    m && "h-9 text-sm"
                  )}
                >
                  <SelectValue placeholder="Bitte wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intakt">Intakt</SelectItem>
                  <SelectItem value="kastriert">Kastriert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label
              className={cn(
                "block font-medium text-sage-900",
                m ? "text-xs mb-1.5" : "text-sm mb-3"
              )}
            >
              Wann sind Betreuungen/Urlaube geplant?
            </label>
            <div className="flex items-start gap-2">
              <Checkbox
                id={`${idPrefix}schulferienBW`}
                checked={formData.schulferienBW}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    schulferienBW: checked === true,
                  })
                }
                className={cn("border-sage-300 mt-0.5", m && "h-4 w-4")}
              />
              <Label
                htmlFor={`${idPrefix}schulferienBW`}
                className={cn(
                  "text-gray-700 cursor-pointer leading-snug",
                  m ? "text-xs" : "text-sm"
                )}
              >
                Klassische Schulferien Baden-Württemberg
              </Label>
            </div>
          </div>

          <div>
            <label
              className={cn(
                "block font-medium text-sage-900",
                m ? "text-xs mb-1.5" : "text-sm mb-3"
              )}
            >
              Ist schon ein konkreter Urlaub geplant? *
            </label>
            <RadioGroup
              value={formData.konkreterUrlaub}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  konkreterUrlaub: value,
                  urlaubVon: value === "nein" ? "" : formData.urlaubVon,
                  urlaubBis: value === "nein" ? "" : formData.urlaubBis,
                })
              }}
              className={cn("flex", m ? "gap-5 flex-wrap" : "gap-6")}
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="ja"
                  id={`${idPrefix}urlaub-ja`}
                  className="border-sage-300"
                />
                <Label
                  htmlFor={`${idPrefix}urlaub-ja`}
                  className={cn(
                    "text-gray-700 cursor-pointer",
                    m ? "text-xs" : "text-sm"
                  )}
                >
                  Ja
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="nein"
                  id={`${idPrefix}urlaub-nein`}
                  className="border-sage-300"
                />
                <Label
                  htmlFor={`${idPrefix}urlaub-nein`}
                  className={cn(
                    "text-gray-700 cursor-pointer",
                    m ? "text-xs" : "text-sm"
                  )}
                >
                  Nein
                </Label>
              </div>
            </RadioGroup>

            {formData.konkreterUrlaub === "ja" && (
              <div className={cn(m ? "mt-2" : "mt-4")}>
                <label className={labelCls}>
                  Urlaubszeitraum *{" "}
                  <span className="text-gray-500 font-normal">(Von - Bis)</span>
                </label>
                <div className={grid2}>
                  <div>
                    <label className={labelCls}>Von *</label>
                    <div className="relative">
                      <Input
                        type="date"
                        required
                        value={formData.urlaubVon}
                        onChange={(e) => {
                          setFormData({ ...formData, urlaubVon: e.target.value })
                        }}
                        min={new Date().toISOString().split("T")[0]}
                        className={cn(
                          inputCls,
                          "pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        )}
                        id={vonInputId}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById(
                            vonInputId
                          ) as HTMLInputElement
                          if (input) {
                            if (typeof input.showPicker === "function") {
                              input.showPicker()
                            } else {
                              input.click()
                            }
                          }
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-600 hover:text-sage-700 cursor-pointer"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Bis *</label>
                    <div className="relative">
                      <Input
                        type="date"
                        required
                        value={formData.urlaubBis}
                        onChange={(e) => {
                          setFormData({ ...formData, urlaubBis: e.target.value })
                        }}
                        min={
                          formData.urlaubVon ||
                          new Date().toISOString().split("T")[0]
                        }
                        className={cn(
                          inputCls,
                          "pr-10 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        )}
                        id={bisInputId}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById(
                            bisInputId
                          ) as HTMLInputElement
                          if (input) {
                            if (typeof input.showPicker === "function") {
                              input.showPicker()
                            } else {
                              input.click()
                            }
                          }
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-600 hover:text-sage-700 cursor-pointer"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {formData.service !== "hundepension" && (
        <div>
          <label className={labelCls}>Ihr Tier</label>
          <Input
            placeholder="z.B. Hund, Katze, Name, Rasse"
            value={formData.pet}
            onChange={(e) =>
              setFormData({ ...formData, pet: e.target.value })
            }
            className={inputCls}
          />
        </div>
      )}

      <div>
        <label className={labelCls}>Ihre Nachricht *</label>
        <Textarea
          rows={m ? 3 : 4}
          placeholder="Erzählen Sie uns mehr über Ihr Tier und Ihre Wünsche..."
          required
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className={cn(
            "border-sage-300 focus:border-sage-500 min-h-0",
            m && "min-h-[72px] max-h-40 text-sm"
          )}
        />
      </div>

      <div>
        <label className={labelCls}>Beste Erreichbarkeits-Zeitfenster *</label>
        <Input
          required
          placeholder="z.B. Montag-Freitag 18-20 Uhr, Wochenende ganztags"
          value={formData.availability}
          onChange={(e) =>
            setFormData({ ...formData, availability: e.target.value })
          }
          className={inputCls}
        />
      </div>

      <div className={cn("flex items-start gap-2", m && "gap-2.5")}>
        <input
          type="checkbox"
          id={`${idPrefix}privacy`}
          required
          checked={formData.privacy}
          onChange={(e) =>
            setFormData({ ...formData, privacy: e.target.checked })
          }
          className={cn("mt-1 shrink-0", m && "h-3.5 w-3.5")}
        />
        <label
          htmlFor={`${idPrefix}privacy`}
          className={cn(
            "text-gray-600 leading-snug",
            m ? "text-xs" : "text-sm"
          )}
        >
          Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
          <a href="/datenschutz" className="text-sage-600 hover:underline">
            Datenschutzerklärung
          </a>{" "}
          zu. *
        </label>
      </div>

      {submitStatus.type && (
        <div
          className={cn(
            "rounded-lg",
            m ? "p-2.5 text-xs sm:text-sm" : "p-4",
            submitStatus.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          )}
        >
          {submitStatus.message}
        </div>
      )}

      <Button
        type="submit"
        size={m ? "default" : "lg"}
        className={cn(
          "w-full bg-sage-600 hover:bg-sage-700 text-white disabled:opacity-50 disabled:cursor-not-allowed",
          m && "h-10 text-sm"
        )}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Wird gesendet..." : "Anfrage senden"}
      </Button>
    </form>
  )

  if (bare) {
    return formInner
  }

  return (
    <Card
      className={cn(
        "border-sage-200",
        m && "border-sage-200/90 shadow-none sm:shadow-sm"
      )}
    >
      <CardHeader
        className={cn(m ? "space-y-0 p-4 pb-3 sm:p-5 sm:pb-3" : undefined)}
      >
        <CardTitle
          className={cn(
            "font-raleway font-bold text-sage-900 leading-tight",
            m ? "text-base sm:text-lg" : "text-xl"
          )}
        >
          Unverbindliche Anfrage
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(m && "p-4 pt-0 sm:p-5 sm:pt-0")}>
        {formInner}
      </CardContent>
    </Card>
  )
}
