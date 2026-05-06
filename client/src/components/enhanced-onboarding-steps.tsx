// Enhanced Onboarding Steps for Detailed Funding Assessment

export const enhancedOnboardingSteps = `
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">Market & Competition</h2>
                      <p className="text-muted-foreground">Help us understand your market position</p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Business Model</Label>
                      <RadioGroup 
                        onValueChange={(val) => form.setValue("businessModel", val as any)} 
                        defaultValue={form.getValues("businessModel")}
                        className="grid grid-cols-2 gap-4"
                      >
                        {[
                          { id: 'B2B', label: 'B2B', desc: 'Business to Business' },
                          { id: 'B2C', label: 'B2C', desc: 'Business to Consumer' },
                          { id: 'B2B2C', label: 'B2B2C', desc: 'Business to Business to Consumer' },
                          { id: 'Marketplace', label: 'Marketplace', desc: 'Multi-sided platform' }
                        ].map((model, idx) => (
                          <motion.div 
                            key={model.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <RadioGroupItem value={model.id} id={\`model-\${model.id}\`} className="peer sr-only" />
                            <motion.label
                              htmlFor={\`model-\${model.id}\`}
                              className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all card-hover"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="font-semibold">{model.label}</span>
                              <span className="text-xs text-muted-foreground mt-1">{model.desc}</span>
                            </motion.label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.businessModel && <p className="text-destructive text-sm">{form.formState.errors.businessModel.message}</p>}
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Customer Base Size</Label>
                      <RadioGroup 
                        onValueChange={(val) => form.setValue("customerBase", val as any)} 
                        defaultValue={form.getValues("customerBase")}
                        className="grid grid-cols-2 gap-4"
                      >
                        {[
                          { id: '0-10', label: '0-10', desc: 'Early validation' },
                          { id: '10-100', label: '10-100', desc: 'Initial traction' },
                          { id: '100-1000', label: '100-1000', desc: 'Growing base' },
                          { id: '1000+', label: '1000+', desc: 'Established base' }
                        ].map((base, idx) => (
                          <motion.div 
                            key={base.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <RadioGroupItem value={base.id} id={\`base-\${base.id}\`} className="peer sr-only" />
                            <motion.label
                              htmlFor={\`base-\${base.id}\`}
                              className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all card-hover"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="font-semibold">{base.label}</span>
                              <span className="text-xs text-muted-foreground mt-1">{base.desc}</span>
                            </motion.label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.customerBase && <p className="text-destructive text-sm">{form.formState.errors.customerBase.message}</p>}
                    </div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="competitiveAdvantage">Competitive Advantage</Label>
                      <textarea 
                        id="competitiveAdvantage" 
                        placeholder="What makes your solution unique? What's your competitive moat?" 
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[80px] resize-none"
                        {...form.register("competitiveAdvantage")}
                      />
                      {form.formState.errors.competitiveAdvantage && <p className="text-destructive text-sm">{form.formState.errors.competitiveAdvantage.message}</p>}
                    </motion.div>

                    <div className="space-y-4">
                      <Label className="text-base">Total Addressable Market (TAM)</Label>
                      <RadioGroup 
                        onValueChange={(val) => form.setValue("marketSize", val as any)} 
                        defaultValue={form.getValues("marketSize")}
                        className="grid grid-cols-2 gap-4"
                      >
                        {[
                          { id: '<100Cr', label: '< ₹100 Cr', desc: 'Niche market' },
                          { id: '100-1000Cr', label: '₹100-1000 Cr', desc: 'Medium market' },
                          { id: '1000-10000Cr', label: '₹1000-10000 Cr', desc: 'Large market' },
                          { id: '10000Cr+', label: '₹10000+ Cr', desc: 'Massive market' }
                        ].map((market, idx) => (
                          <motion.div 
                            key={market.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <RadioGroupItem value={market.id} id={\`market-\${market.id}\`} className="peer sr-only" />
                            <motion.label
                              htmlFor={\`market-\${market.id}\`}
                              className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all card-hover"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="font-semibold">{market.label}</span>
                              <span className="text-xs text-muted-foreground mt-1">{market.desc}</span>
                            </motion.label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.marketSize && <p className="text-destructive text-sm">{form.formState.errors.marketSize.message}</p>}
                    </div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">Financial Health</h2>
                      <p className="text-muted-foreground">Help us assess your financial position</p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Previous Funding History</Label>
                      <RadioGroup 
                        onValueChange={(val) => form.setValue("fundingHistory", val as any)} 
                        defaultValue={form.getValues("fundingHistory")}
                        className="grid gap-3"
                      >
                        {[
                          { id: 'None', label: 'No previous funding', desc: 'First time raising' },
                          { id: 'Bootstrapped', label: 'Bootstrapped', desc: 'Self-funded so far' },
                          { id: 'Friends & Family', label: 'Friends & Family', desc: 'Informal funding' },
                          { id: 'Angel', label: 'Angel Investment', desc: 'Professional angels' },
                          { id: 'VC', label: 'Venture Capital', desc: 'Institutional funding' }
                        ].map((history, idx) => (
                          <motion.div 
                            key={history.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <RadioGroupItem value={history.id} id={\`history-\${history.id}\`} className="peer sr-only" />
                            <motion.label
                              htmlFor={\`history-\${history.id}\`}
                              className="flex items-center space-x-4 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all card-hover"
                              whileHover={{ scale: 1.01, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex-1">
                                <p className="font-semibold">{history.label}</p>
                                <p className="text-sm text-muted-foreground">{history.desc}</p>
                              </div>
                            </motion.label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.fundingHistory && <p className="text-destructive text-sm">{form.formState.errors.fundingHistory.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label className="text-base">Monthly Burn Rate</Label>
                        <RadioGroup 
                          onValueChange={(val) => form.setValue("burnRate", val as any)} 
                          defaultValue={form.getValues("burnRate")}
                          className="grid gap-3"
                        >
                          {[
                            { id: '<50K', label: '< ₹50K' },
                            { id: '50K-2L', label: '₹50K - ₹2L' },
                            { id: '2L-10L', label: '₹2L - ₹10L' },
                            { id: '10L+', label: '₹10L+' }
                          ].map((burn, idx) => (
                            <motion.div 
                              key={burn.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <RadioGroupItem value={burn.id} id={\`burn-\${burn.id}\`} className="peer sr-only" />
                              <motion.label
                                htmlFor={\`burn-\${burn.id}\`}
                                className="flex items-center justify-center rounded-xl border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all card-hover"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <span className="font-semibold text-sm">{burn.label}</span>
                              </motion.label>
                            </motion.div>
                          ))}
                        </RadioGroup>
                        {form.formState.errors.burnRate && <p className="text-destructive text-sm">{form.formState.errors.burnRate.message}</p>}
                      </div>

                      <div className="space-y-4">
                        <Label className="text-base">Current Runway</Label>
                        <RadioGroup 
                          onValueChange={(val) => form.setValue("runway", val as any)} 
                          defaultValue={form.getValues("runway")}
                          className="grid gap-3"
                        >
                          {[
                            { id: '<6 months', label: '< 6 months' },
                            { id: '6-12 months', label: '6-12 months' },
                            { id: '12-24 months', label: '12-24 months' },
                            { id: '24+ months', label: '24+ months' }
                          ].map((runway, idx) => (
                            <motion.div 
                              key={runway.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <RadioGroupItem value={runway.id} id={\`runway-\${runway.id}\`} className="peer sr-only" />
                              <motion.label
                                htmlFor={\`runway-\${runway.id}\`}
                                className="flex items-center justify-center rounded-xl border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all card-hover"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <span className="font-semibold text-sm">{runway.label}</span>
                              </motion.label>
                            </motion.div>
                          ))}
                        </RadioGroup>
                        {form.formState.errors.runway && <p className="text-destructive text-sm">{form.formState.errors.runway.message}</p>}
                      </div>
                    </div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label htmlFor="keyMetrics">Key Business Metrics</Label>
                      <textarea 
                        id="keyMetrics" 
                        placeholder="Share your key metrics: CAC, LTV, MRR, churn rate, growth rate, etc." 
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[100px] resize-none"
                        {...form.register("keyMetrics")}
                      />
                      {form.formState.errors.keyMetrics && <p className="text-destructive text-sm">{form.formState.errors.keyMetrics.message}</p>}
                    </motion.div>
                  </motion.div>
                )}
`;

export default enhancedOnboardingSteps;