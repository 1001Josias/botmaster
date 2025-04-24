"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, Plus, Trash2 } from "lucide-react"

export function PublishForm() {
  const [itemType, setItemType] = useState("worker")
  const [pricingType, setPricingType] = useState("free")
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleAddScreenshot = () => {
    // Em um cenário real, aqui seria feito o upload da imagem
    // Para este exemplo, estamos apenas adicionando um placeholder
    setScreenshots([...screenshots, "/placeholder.svg?height=200&width=300"])
  }

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica para enviar o formulário
    console.log("Form submitted")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="pricing">Preço e Publicação</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Forneça as informações essenciais sobre o seu recurso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="item-type">Tipo de Recurso</Label>
                  <Select value={itemType} onValueChange={setItemType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worker">Worker</SelectItem>
                      <SelectItem value="workflow">Workflow</SelectItem>
                      <SelectItem value="process">Process</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Nome do seu recurso" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short-description">Descrição Curta</Label>
                  <Input
                    id="short-description"
                    placeholder="Uma breve descrição (máx. 100 caracteres)"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Completa</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva detalhadamente o seu recurso, suas funcionalidades e benefícios"
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version">Versão</Label>
                  <Input id="version" placeholder="Ex: 1.0.0" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes</CardTitle>
              <CardDescription>
                Adicione mais informações para ajudar os usuários a entenderem seu recurso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Adicionar tag"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag}>
                      Adicionar
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-secondary-foreground/70 hover:text-secondary-foreground"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Screenshots</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {screenshots.map((screenshot, index) => (
                      <div key={index} className="relative">
                        <img
                          src={screenshot || "/placeholder.svg"}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => handleRemoveScreenshot(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="h-32 flex flex-col items-center justify-center gap-2"
                      onClick={handleAddScreenshot}
                    >
                      <Upload className="h-6 w-6" />
                      <span>Adicionar</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video-url">URL do Vídeo (opcional)</Label>
                  <Input id="video-url" placeholder="URL do vídeo de demonstração" />
                  <p className="text-xs text-muted-foreground">Suportamos links do YouTube e Vimeo</p>
                </div>

                <div className="space-y-2">
                  <Label>Requisitos</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input placeholder="Nome do requisito" />
                      <Button type="button" size="sm" variant="ghost">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preço e Publicação</CardTitle>
              <CardDescription>Defina como seu recurso será disponibilizado no marketplace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Modelo de Preço</Label>
                  <RadioGroup value={pricingType} onValueChange={setPricingType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="free" id="free" />
                      <Label htmlFor="free">Gratuito</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paid" id="paid" />
                      <Label htmlFor="paid">Pago (preço único)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="subscription" id="subscription" />
                      <Label htmlFor="subscription">Incluir em assinatura</Label>
                    </div>
                  </RadioGroup>
                </div>

                {pricingType === "paid" && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (USD)</Label>
                    <Input id="price" type="number" min="0" step="0.01" placeholder="Ex: 19.99" />
                  </div>
                )}

                {pricingType === "subscription" && (
                  <div className="space-y-2">
                    <Label>Planos de Assinatura</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="premium" />
                        <Label htmlFor="premium">Premium ($9.99/mês)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="enterprise" />
                        <Label htmlFor="enterprise">Enterprise ($29.99/mês)</Label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">
                      Concordo com os{" "}
                      <a href="#" className="text-primary underline">
                        termos e condições
                      </a>{" "}
                      do Marketplace
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline">
                Salvar como rascunho
              </Button>
              <Button type="submit">Publicar no Marketplace</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}

