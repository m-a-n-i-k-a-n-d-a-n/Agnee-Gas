import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Plus, Save, X, Trash2 } from 'lucide-react';
import { Buyer } from '@/constants/billing';
import { toast } from 'sonner';
import { useBuyers } from '@/context/BuyerContext';

const BuyerManagement = () => {
  const { buyers, addBuyer, updateBuyer, deleteBuyer } = useBuyers();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Buyer>>({});
  const [tempBuyer, setTempBuyer] = useState<Buyer | null>(null); // 🆕

  const handleEdit = (buyer: Buyer) => {
    setEditingId(buyer.gstin);
    setEditForm(buyer);
  };

  const handleSave = (buyer: Buyer) => {
    if (!editForm.name || !editForm.gstin || !editForm.state || !editForm.stateCode) {
      toast.error('Name, GSTIN, State, and State Code are required');
      return;
    }

    const updatedBuyer: Buyer = {
      ...buyer,
      ...editForm,
    };

    const isNew = !buyers.find(b => b.gstin === updatedBuyer.gstin);

    if (isNew) {
      addBuyer(updatedBuyer);
      setTempBuyer(null); // 🧼 clear unsaved row
    } else {
      updateBuyer(updatedBuyer);
    }

    setEditingId(null);
    setEditForm({});
    toast.success(`Buyer ${isNew ? 'added' : 'updated'} successfully`);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setTempBuyer(null); // 🧼 discard unsaved row
  };

  const handleAdd = () => {
    const newBuyer: Buyer = {
      name: '',
      address: '',
      gstin: `33${Date.now()}1Z5`,
      state: 'Tamil Nadu',
      stateCode: '33',
    };

    setTempBuyer(newBuyer); // only insert in UI
    setEditingId(newBuyer.gstin);
    setEditForm(newBuyer);
  };

  const handleDelete = (gstin: string) => {
    if (window.confirm('Are you sure you want to delete this buyer? This action cannot be undone.')) {
      deleteBuyer(gstin);
      toast.success('Buyer deleted successfully');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Buyer Management</h2>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Buyer
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>State</TableHead>
                <TableHead>State Code</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...buyers, ...(tempBuyer ? [tempBuyer] : [])].map(buyer => (
                <TableRow key={buyer.gstin}>
                  {editingId === buyer.gstin ? (
                    <>
                      <TableCell>
                        <Input
                          value={editForm.name || ''}
                          onChange={e => setEditForm(current => ({ ...current, name: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.address || ''}
                          onChange={e => setEditForm(current => ({ ...current, address: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.gstin || ''}
                          onChange={e => setEditForm(current => ({ ...current, gstin: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.state || ''}
                          onChange={e => setEditForm(current => ({ ...current, state: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm.stateCode || ''}
                          onChange={e => setEditForm(current => ({ ...current, stateCode: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleSave(buyer)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{buyer.name}</TableCell>
                      <TableCell>{buyer.address}</TableCell>
                      <TableCell>{buyer.gstin}</TableCell>
                      <TableCell>{buyer.state}</TableCell>
                      <TableCell>{buyer.stateCode}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(buyer)}>
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(buyer.gstin)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuyerManagement;
