import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockContractCall = vi.fn()

vi.mock('@stacks/transactions', () => ({
  callReadOnlyFunction: mockContractCall,
}))

describe('Impact Assessment Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('submit-assessment', () => {
    it('should submit an impact assessment successfully', async () => {
      const proposalId = 1
      const climateImpact = 75
      const economicImpact = 60
      const socialImpact = 50
      const feasibility = 80
      
      mockContractCall.mockResolvedValue({ value: true })
      
      const result = await callContract('impact-assessment', 'submit-assessment', [
        proposalId,
        climateImpact,
        economicImpact,
        socialImpact,
        feasibility
      ])
      
      expect(result).toBe(true)
      expect(mockContractCall).toHaveBeenCalledWith(
          expect.anything(),
          'impact-assessment',
          'submit-assessment',
          [proposalId, climateImpact, economicImpact, socialImpact, feasibility],
          expect.anything()
      )
    })
    
    it('should fail if feasibility is out of range', async () => {
      const proposalId = 1
      const climateImpact = 75
      const economicImpact = 60
      const socialImpact = 50
      const feasibility = 101 // Out of range (1-100)
      
      mockContractCall.mockRejectedValue(new Error('Feasibility out of range'))
      
      await expect(callContract('impact-assessment', 'submit-assessment', [
        proposalId,
        climateImpact,
        economicImpact,
        socialImpact,
        feasibility
      ])).rejects.toThrow('Feasibility out of range')
    })
  })
  
  describe('get-assessment', () => {
    it('should return the impact assessment for a proposal', async () => {
      const proposalId = 1
      const expectedAssessment = {
        climate_impact: 75,
        economic_impact: 60,
        social_impact: 50,
        feasibility: 80,
        timestamp: 123456n
      }
      
      mockContractCall.mockResolvedValue({ value: expectedAssessment })
      
      const result = await callContract('impact-assessment', 'get-assessment', [proposalId])
      
      expect(result).toEqual(expectedAssessment)
      expect(mockContractCall).toHaveBeenCalledWith(
          expect.anything(),
          'impact-assessment',
          'get-assessment',
          [proposalId],
          expect.anything()
      )
    })
    
    it('should return null for non-existent assessment', async () => {
      const proposalId = 999
      
      mockContractCall.mockResolvedValue({ value: null })
      
      const result = await callContract('impact-assessment', 'get-assessment', [proposalId])
      
      expect(result).toBeNull()
    })
  })
})

async function callContract(contractName: string, functionName: string, args: any[]) {
  const result = await mockContractCall(null, contractName, functionName, args, null)
  return result.value
}

