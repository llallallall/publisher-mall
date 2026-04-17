export const usePayment = () => {
  const config = useRuntimeConfig()
  
  const payWithPortone = async (options: {
    orderCode: string,
    amount: number,
    name: string,
    buyer_email?: string,
    buyer_name?: string,
    pg?: string
  }) => {
    return new Promise((resolve, reject) => {
      const { IMP } = window as any;
      if (!IMP) {
        return reject(new Error('Portone SDK가 로드되지 않았습니다.'));
      }

      // Initialize with Sandbox Store ID (User should replace with real ID in production)
      IMP.init('imp00000000'); 

      IMP.request_pay({
        pg: options.pg || 'html5_inicis.INIpayTest', // Sandbox PG
        pay_method: 'card',
        merchant_uid: options.orderCode,
        name: options.name,
        amount: options.amount,
        buyer_email: options.buyer_email,
        buyer_name: options.buyer_name,
        m_redirect_url: window.location.origin + '/payment/success' // Mobile redirect
      }, (rsp: any) => {
        if (rsp.success) {
          resolve(rsp);
        } else {
          reject(new Error(rsp.error_msg));
        }
      });
    });
  }

  return {
    payWithPortone
  };
};
