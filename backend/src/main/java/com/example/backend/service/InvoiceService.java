package com.example.backend.service;

import com.example.backend.domain.Invoice;
import com.example.backend.domain.request.ReqInvoice;
import com.example.backend.domain.response.ResInvoiceDTO;

import java.util.List;

public interface InvoiceService {
    ResInvoiceDTO handleCreateInvoice(ReqInvoice req);
    List<ResInvoiceDTO> handleGetAllInvoices();
    ResInvoiceDTO handleGetInvoiceById(Long id);
    ResInvoiceDTO handleUpdateInvoice(Long id, Invoice invoice);
    void handleDeleteInvoice(Long id);
}
